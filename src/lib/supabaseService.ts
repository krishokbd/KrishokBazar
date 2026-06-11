/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FarmerPost, PostComment, Product } from '../types';

// Lazy-loaded Supabase Config Check
export const getSupabaseConfig = () => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL;
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

  const isConfigured = !!(url && key && url.trim().length > 0 && key.trim().length > 0);
  return { url, key, isConfigured };
};

/**
 * Tracks engagement data in Supabase (likes and comments)
 * Designed to cleanly fall back to local Firestore if Supabase keys are not yet configured.
 */
export const supabaseService = {
  /**
   * Sync a post entity to Supabase
   */
  async savePost(post: FarmerPost): Promise<boolean> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      console.log(`[SUPABASE INTEGRATION LOG] Safe Fallback Active. (To engage live Supabase, configure VITE_SUPABASE_URL in your secrets). Post ID '${post.id}' synced natively over Firestore.`);
      return false;
    }

    try {
      console.log(`[SUPABASE SYNCING] Writing social post data to Supabase table 'posts'...`);
      const response = await fetch(`${url}/rest/v1/posts`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: post.id,
          farmer_id: post.farmerId,
          farmer_name: post.farmerName,
          content: post.content,
          images: post.images,
          videos: post.videos,
          likes_count: post.likes,
          liked_by_users: post.likedByUserIds || [],
          comments_json: JSON.stringify(post.comments),
          created_at: post.createdAt
        })
      });

      if (!response.ok) {
        throw new Error(`Supabase returned status ${response.status}`);
      }

      console.log(`[SUPABASE SUCCESS] Post '${post.id}' written successfully to remote database.`);
      return true;
    } catch (err) {
      console.error(`[SUPABASE SYNC ERROR] Failed to push post to Supabase:`, err);
      return false;
    }
  },

  /**
   * Track user likeness toggle event in Supabase Table 'post_likes' or update 'posts' row
   */
  async trackLike(postId: string, userId: string, hasLiked: boolean, nextLikesCount: number): Promise<boolean> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      console.log(`[SUPABASE LOG] Like tracked per user locally and verified over live Firestore. User ID: '${userId}' -> Post ID: '${postId}' (Likes: ${nextLikesCount})`);
      return false;
    }

    try {
      console.log(`[SUPABASE SYNCING] Registering likeness transaction for Post '${postId}'...`);
      
      // Update main post row total Likes list
      const updatePostPromise = fetch(`${url}/rest/v1/posts?id=eq.${postId}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          likes_count: nextLikesCount
        })
      });

      // Insert transaction log row in 'post_likes' matching user-post pair
      const insertLikePromise = fetch(`${url}/rest/v1/post_likes`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: `${postId}_${userId}`,
          post_id: postId,
          user_id: userId,
          liked_at: new Date().toISOString(),
          status_active: hasLiked
        })
      });

      const [resUpdate] = await Promise.all([updatePostPromise, insertLikePromise]);

      if (!resUpdate.ok) {
        throw new Error(`PATCH request failed with status ${resUpdate.status}`);
      }

      console.log(`[SUPABASE SUCCESS] Engagement likeness synced successfully.`);
      return true;
    } catch (err) {
      console.error(`[SUPABASE ENGAGEMENT ERROR] Failed to record likeness event:`, err);
      return false;
    }
  },

  /**
   * Stores and indexes comments and nested replies
   */
  async trackComment(postId: string, comment: PostComment, updatedCommentsList: PostComment[]): Promise<boolean> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      console.log(`[SUPABASE LOG] Comment recorded locally. Comment ID: '${comment.id}' in Post: '${postId}' -> Natively stored in Firestore.`);
      return false;
    }

    try {
      console.log(`[SUPABASE SYNCING] Writing comment & nesting relationships representing parent context...`);

      // 1. Update the parent post's aggregate comment catalog JSON in 'posts' Table
      const syncPostPromise = fetch(`${url}/rest/v1/posts?id=eq.${postId}`, {
        method: 'PATCH',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comments_json: JSON.stringify(updatedCommentsList)
        })
      });

      // 2. Insert analytical row in 'post_comments' Table (supports nested records via parent_id reference)
      const syncCommentPromise = fetch(`${url}/rest/v1/post_comments`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: comment.id,
          post_id: postId,
          user_name: comment.userName,
          content: comment.content,
          created_at: comment.createdAt,
          farmer_id: comment.farmerId || null,
          parent_id: comment.parentId || null
        })
      });

      const [resPost, resComment] = await Promise.all([syncPostPromise, syncCommentPromise]);

      if (!resPost.ok || !resComment.ok) {
        throw new Error(`Failed to update comments, responses: Post ${resPost.status}, Comment ${resComment.status}`);
      }

      console.log(`[SUPABASE SUCCESS] Engagement comment nested layer synced successfully.`);
      return true;
    } catch (err) {
      console.error(`[SUPABASE COMMENT SYNC ERROR] Failed to write nested comment logs:`, err);
      return false;
    }
  },

  /**
   * Syncs a product record directly to Supabase
   */
  async syncProduct(product: Product): Promise<boolean> {
    const { url, key, isConfigured } = getSupabaseConfig();
    if (!isConfigured) {
      console.log(`[SUPABASE INTEGRATION LOG] Safe Fallback Active. Product '${product.title}' (ID: ${product.id}) saved natively over Firestore. This instantly updates the customer facing catalog.`);
      return false;
    }

    try {
      console.log(`[SUPABASE SYNCING] Upserting product '${product.title}' to Supabase table 'products'...`);
      const response = await fetch(`${url}/rest/v1/products`, {
        method: 'POST',
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          id: product.id,
          title: product.title,
          price: product.price,
          discount_price: product.discountPrice || null,
          discountPrice: product.discountPrice || null,
          category: product.category,
          description: product.description,
          images: product.images,
          stock: product.stock,
          farmer_id: product.farmerId || null,
          farmerId: product.farmerId || null,
          farmer_name: product.farmerName || null,
          farmerName: product.farmerName || null,
          is_verified: product.isVerified || false,
          isVerified: product.isVerified || false,
          rating: product.rating || null,
          unit: product.unit || null,
          is_ready_to_cook: product.isReadyToCook || false,
          isReadyToCook: product.isReadyToCook || false,
          is_featured: product.isFeatured || false,
          isFeatured: product.isFeatured || false,
          googleDriveFolderUrl: product.googleDriveFolderUrl || null,
          google_drive_folder_url: product.googleDriveFolderUrl || null
        })
      });

      if (!response.ok) {
        throw new Error(`Supabase responses error: status ${response.status}`);
      }

      console.log(`[SUPABASE SUCCESS] Product '${product.id}' successfully upserted to remote database.`);
      return true;
    } catch (err) {
      console.error(`[SUPABASE PRODUCT SYNC ERROR] Failed to push product to Supabase:`, err);
      return false;
    }
  }
};
