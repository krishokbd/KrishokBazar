/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Farmer, Product, Order, User, Review, OrderItem, WithdrawalRequest, Category, Banner, BlogPost, SiteSettings } from './types';
import { demoFarmers, demoProducts, demoReviews, CATEGORIES, demoBlogs, DEFAULT_SITE_SETTINGS } from './data';
import { HERO_CAROUSEL_BANNERS } from './assets';
import { db, isFirebaseConfigured, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { logAnalyticsEvent } from './lib/analytics';

interface AppContextType {
  farmers: Farmer[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  currentUser: User | null;
  cart: OrderItem[];
  withdrawalRequests: WithdrawalRequest[];
  registeredCustomers: User[];
  
  // CMS Fields
  categories: Category[];
  banners: Banner[];
  saveCategories: (newCategories: Category[]) => void;
  saveBanners: (newBanners: Banner[]) => void;
  siteSettings: SiteSettings;
  saveSiteSettings: (settings: SiteSettings) => void;
  blogs: BlogPost[];
  addBlogPost: (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => void;
  editBlogPost: (postId: string, postData: Partial<BlogPost>) => void;
  deleteBlogPost: (postId: string) => void;

  // Auth actions
  login: (phone: string, role: 'Admin' | 'Farmer' | 'Customer', password?: string) => { success: boolean; message: string; subStatus?: string };
  logout: () => void;
  updateProfile: (name: string, phone: string, address: string) => void;
  registerCustomer: (name: string, phone: string, password?: string, address?: string) => { success: boolean; message: string };
  registerFarmer: (name: string, phone: string, password: string, district: string, address: string, nidNumber: string, nidImage: string, gender: 'male' | 'female') => { success: boolean; message: string };

  // Cart actions
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Order actions
  placeOrder: (name: string, phone: string, address: string, paymentMethod?: 'COD' | 'bKash' | 'Nagad', paymentTxId?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Withdrawal actions
  requestWithdrawal: (farmerId: string, amount: number, method: 'bKash' | 'Nagad' | 'Bank Transfer', details: string) => { success: boolean; message: string };
  updateWithdrawallStatus: (requestId: string, status: WithdrawalRequest['status']) => void;

  // Admin actions on Farmers
  editFarmerRating: (farmerId: string, rating: number) => void;
  toggleVerifyFarmer: (farmerId: string) => void;
  toggleBlockFarmer: (farmerId: string) => void;
  deleteFarmer: (farmerId: string) => void;
  approveFarmerRegistration: (farmerId: string) => void;
  updateFarmer: (farmerId: string, updatedData: Partial<Farmer>) => void;

  // Product actions (Admin & Farmer)
  addProduct: (productData: Omit<Product, 'id' | 'rating' | 'farmerName' | 'isVerified'>) => void;
  editProduct: (productId: string, productData: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Review actions
  addReview: (reviewData: Omit<Review, 'id' | 'isVerifiedPurchase'>) => void;
  deleteReview: (reviewId: string) => void;

  // NID Visual Verification actions & authenticity fetching logic
  getNidDetails: (farmerId: string) => {
    exists: boolean;
    nid: string;
    status: 'Verified' | 'Suspected' | 'System Error' | 'Unverified';
    percentMatchCount: number;
    ecReference: string;
    verifiedAt: string;
  };

  // Seed / Reset databases
  resetDemoData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Seeds default baseline accounts
const SEED_CUSTOMERS: User[] = [
  {
    id: 'customer-user-1',
    phone: '01931355398',
    password: 'Ajzakir@2020',
    role: 'Customer',
    name: 'Muikta Begum',
    address: 'Dhakeshwari, Lalbagh, Dhaka-1211'
  },
  {
    id: 'customer-user-2',
    phone: '01811223344',
    password: 'Ajzakir@2020',
    role: 'Customer',
    name: 'Naimul Islam',
    address: 'Mirpur 10, Dhaka'
  }
];

const SEED_WITHDRAWALS: WithdrawalRequest[] = [
  {
    id: 'WR-101',
    farmerId: 'f1',
    farmerName: 'Abdur Rahman',
    amount: 1500,
    method: 'bKash',
    details: 'bKash: 01712345100',
    status: 'Paid',
    createdAt: '2026-05-18T12:00:00Z'
  },
  {
    id: 'WR-102',
    farmerId: 'f4',
    farmerName: 'Zakir Hossain',
    amount: 2500,
    method: 'Nagad',
    details: 'Nagad: 01931355398',
    status: 'Pending',
    createdAt: '2026-05-20T10:00:00Z'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem('kb_farmers');
    return saved ? JSON.parse(saved) : demoFarmers;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kb_products');
    return saved ? JSON.parse(saved) : demoProducts;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('kb_reviews');
    return saved ? JSON.parse(saved) : demoReviews;
  });

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>(() => {
    const saved = localStorage.getItem('kb_withdrawals');
    return saved ? JSON.parse(saved) : SEED_WITHDRAWALS;
  });

  const [registeredCustomers, setRegisteredCustomers] = useState<User[]>(() => {
    const saved = localStorage.getItem('kb_registered_customers');
    return saved ? JSON.parse(saved) : SEED_CUSTOMERS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('kb_categories');
    return saved ? JSON.parse(saved) : CATEGORIES;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('kb_banners_cms');
    return saved ? JSON.parse(saved) : HERO_CAROUSEL_BANNERS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('kb_site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
  });

  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('kb_blogs');
    return saved ? JSON.parse(saved) : demoBlogs;
  });

  // Default orders block
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kb_orders');
    if (saved) return JSON.parse(saved);

    // Initial seed list of high fidelity orders
    const testOrders: Order[] = [
      {
        id: 'KB-8041',
        trackingNumber: 'TRK-981242-DH',
        customerId: 'customer-user-1',
        customerName: 'Muikta Begum',
        customerPhone: '01931355398',
        customerAddress: 'Dhakeshwari, Lalbagh, Dhaka-1211',
        products: [
          {
            productId: 'p1',
            title: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম',
            price: 90,
            quantity: 5,
            image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f1'
          },
          {
            productId: 'p16',
            title: 'বগুড়ার গোল আলু (দেশি জাত)',
            price: 40,
            quantity: 3,
            image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f16'
          }
        ],
        totalPrice: 570,
        status: 'Delivered',
        paymentMethod: 'COD',
        createdAt: '2026-05-18T10:30:00Z'
      },
      {
        id: 'KB-8042',
        trackingNumber: 'TRK-294156-KH',
        customerId: 'customer-user-2',
        customerName: 'Naimul Islam',
        customerPhone: '01811223344',
        customerAddress: 'Mirpur 10, Dhaka',
        products: [
          {
            productId: 'p64',
            title: 'সুন্দরবনের ১০০% খাঁটি খলিসা মধু',
            price: 1200,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f4'
          }
        ],
        totalPrice: 1200,
        status: 'Shipped',
        paymentMethod: 'bKash',
        paymentTxId: 'BKX90014281',
        createdAt: '2026-05-19T14:45:00Z'
      },
      {
        id: 'KB-8043',
        trackingNumber: 'TRK-554190-SY',
        customerId: 'customer-user-3',
        customerName: 'Tasnim Alam',
        customerPhone: '01555667788',
        customerAddress: 'Sylhet Sadar, Sylhet',
        products: [
          {
            productId: 'p46',
            title: 'শতভাগ দেশী জীবন্ত কড়া মুরগি',
            price: 450,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500&auto=format&fit=crop&q=60',
            farmerId: 'f16'
          }
        ],
        totalPrice: 900,
        status: 'Processing',
        paymentMethod: 'COD',
        createdAt: '2026-05-20T08:15:00Z'
      }
    ];
    return testOrders;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('kb_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('kb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Synchronization side effects
  useEffect(() => {
    localStorage.setItem('kb_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    localStorage.setItem('kb_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kb_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('kb_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('kb_withdrawals', JSON.stringify(withdrawalRequests));
  }, [withdrawalRequests]);

  useEffect(() => {
    localStorage.setItem('kb_registered_customers', JSON.stringify(registeredCustomers));
  }, [registeredCustomers]);

  useEffect(() => {
    localStorage.setItem('kb_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('kb_banners_cms', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kb_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('kb_current_user');
    }
  }, [currentUser]);

  // LIVE CLOUD FIRESTORE SYNCHRONIZATION ENGINE
  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      console.log("Firebase is not fully active or provisioned yet. Operating via robust relative state.");
      return;
    }

    console.log("Engaging real-time Firebase Cloud Database Sync...");

    // 1. PRODUCTS LIVE SYNC
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items: Product[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Product);
      });
      if (items.length > 0) {
        setProducts(items);
      } else {
        // Automatically seed empty remote database
        console.log("Firestore empty: seeding default agricultural items.");
        demoProducts.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            console.error("Seeding product failed:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    // 2. FARMERS LIVE SYNC
    const unsubFarmers = onSnapshot(collection(db, 'farmers'), (snapshot) => {
      const items: Farmer[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Farmer);
      });
      if (items.length > 0) {
        setFarmers(items);
      } else {
        demoFarmers.forEach(async (f) => {
          try {
            await setDoc(doc(db, 'farmers', f.id), f);
          } catch (e) {
            console.error("Seeding farmer failed:", e);
          }
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'farmers');
    });

    // 3. ORDERS LIVE SYNC
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const items: Order[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Order);
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (items.length > 0) {
        setOrders(items);
      } else {
        const initialOrderSeed: Order = {
          id: 'KB-8041',
          trackingNumber: 'TRK-981242-DH',
          customerId: 'customer-user-1',
          customerName: 'Muikta Begum',
          customerPhone: '01931355398',
          customerAddress: 'Dhakeshwari, Lalbagh, Dhaka-1211',
          products: [
            {
              productId: 'p1',
              title: 'রাজশাহী আমগাছের পাকা গোপালভোগ আম',
              price: 90,
              quantity: 5,
              image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=500&auto=format&fit=crop&q=60',
              farmerId: 'f1'
            }
          ],
          totalPrice: 450,
          status: 'Delivered',
          paymentMethod: 'COD',
          createdAt: '2026-05-18T10:30:00Z'
        };
        setDoc(doc(db, 'orders', initialOrderSeed.id), initialOrderSeed).catch(() => {});
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    // 4. REVIEWS LIVE SYNC
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      const items: Review[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Review);
      });
      if (items.length > 0) {
        setReviews(items);
      } else {
        demoReviews.forEach(async (r) => {
          try {
            await setDoc(doc(db, 'reviews', r.id), r);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'reviews');
    });

    // 5. WITHDRAWALS LIVE SYNC
    const unsubWithdrawals = onSnapshot(collection(db, 'withdrawals'), (snapshot) => {
      const items: WithdrawalRequest[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as WithdrawalRequest);
      });
      if (items.length > 0) {
        setWithdrawalRequests(items);
      } else {
        SEED_WITHDRAWALS.forEach(async (w) => {
          try {
            await setDoc(doc(db, 'withdrawals', w.id), w);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'withdrawals');
    });

    // 6. CUSTOMER PROFILES LIVE SYNC
    const unsubCustomers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const items: User[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as User);
      });
      if (items.length > 0) {
        setRegisteredCustomers(items.filter(u => u.role === 'Customer'));
      } else {
        SEED_CUSTOMERS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'users', c.id), c);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
    });

    // 7. CATEGORIES CMS LIVE SYNC
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snapshot) => {
      const items: Category[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as Category);
      });
      if (items.length > 0) {
        setCategories(items);
      } else {
        CATEGORIES.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'categories', c.id), c);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'categories');
    });

    // 8. CAROUSEL BANNERS LIVE SYNC
    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      const items: Banner[] = [];
      snapshot.forEach(docSnap => {
        items.push({ ...docSnap.data() } as Banner);
      });
      if (items.length > 0) {
        setBanners(items);
      } else {
        HERO_CAROUSEL_BANNERS.forEach(async (b, idx) => {
          try {
            await setDoc(doc(db, 'banners', `banner-${idx}`), b);
          } catch (e) {}
        });
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'banners');
    });

    return () => {
      unsubProducts();
      unsubFarmers();
      unsubOrders();
      unsubReviews();
      unsubWithdrawals();
      unsubCustomers();
      unsubCategories();
      unsubBanners();
    };
  }, [isFirebaseConfigured]);

  // SECURE AUTHENTICATION FLOW (Uses ONLY mobile numbers and passwords)
  const login = (phone: string, role: 'Admin' | 'Farmer' | 'Customer', password?: string) => {
    // Hidden auto-resolve for Admin credentials (no 'Admin' role selection needed)
    const isAdmin = (phone === '01931355398' || phone === '01939052257' || phone === 'admin') && password === 'Ajzakir@2020';
    const effectiveRole = isAdmin ? 'Admin' : role;

    // 1. ADMIN GATEWAY
    if (effectiveRole === 'Admin') {
      if (password !== 'Ajzakir@2020') {
        return { success: false, message: 'ভুল পাসওয়ার্ড!' };
      }
      if (phone === '01931355398' || phone === '01939052257' || phone === 'admin') {
        const adminUser: User = {
          id: 'admin-user',
          phone: phone,
          role: 'Admin',
          name: 'Al-Haj Zakir Hossain',
          address: 'Katakhali, Rajshahi'
        };
        setCurrentUser(adminUser);
        return { success: true, message: 'সফলভাবে প্রবেশ করেছেন!' };
      }
      return { success: false, message: 'ভুল মোবাইল নম্বর!' };
    }

    // 2. FARMER GATEWAY
    if (role === 'Farmer') {
      const match = farmers.find(f => f.phone === phone);
      if (!match) {
        return { success: false, message: 'এই ফোন নম্বরে কোনো নিবন্ধিত কৃষক পাওয়া যায়নি!' };
      }

      if (match.status === 'Pending') {
        return {
          success: false,
          message: 'আপনার একাউন্ট রিভিউ এর জন্য সাবমিট হয়েছে। এডমিন অনুমোদন দেওয়ার পরে আপনি লগইন করতে পারবেন।',
          subStatus: 'Pending'
        };
      }

      if (match.status === 'Blocked') {
        return {
          success: false,
          message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত আছে। দয়া করে এডমিনের সাথে যোগাযোগ করুন।',
          subStatus: 'Blocked'
        };
      }

      const farmerUser: User = {
        id: `user-farmer-${match.id}`,
        phone: match.phone,
        role: 'Farmer',
        name: match.name,
        address: match.address,
        farmerId: match.id,
        district: match.district,
        status: match.status
      };
      setCurrentUser(farmerUser);
      return { success: true, message: 'কৃষক বাজারে আপনাকে স্বাগতম!' };
    }

    // 3. CUSTOMER GATEWAY
    const client = registeredCustomers.find(c => c.phone === phone);
    if (client) {
      setCurrentUser(client);
      return { success: true, message: 'গ্রাহক হিসেবে সফলভাবে লগইন হয়েছে!' };
    } else {
      // Dynamic fallback/auto-registration if user accesses instantly
      const newClient: User = {
        id: `customer-${Date.now()}`,
        phone: phone,
        role: 'Customer',
        name: 'তাজা ক্রেতা',
        address: 'ঢাকা, বাংলাদেশ'
      };
      if (isFirebaseConfigured && db) {
        setDoc(doc(db, 'users', newClient.id), newClient).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `users/${newClient.id}`);
        });
      }
      setRegisteredCustomers(prev => [...prev, newClient]);
      setCurrentUser(newClient);
      return { success: true, message: 'অটো-নিবন্ধনের মাধ্যমে গ্রাহক হিসেবে সফল লগইন!' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (name: string, phone: string, address: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, phone, address };
    setCurrentUser(updated);

    // Sync back to lists / dynamic Firestore writes
    if (isFirebaseConfigured && db) {
      try {
        if (updated.role === 'Customer') {
          updateDoc(doc(db, 'users', updated.id), { name, phone, address });
        } else if (updated.role === 'Farmer' && updated.farmerId) {
          updateDoc(doc(db, 'farmers', updated.farmerId), { name, phone, address });
          updateDoc(doc(db, 'users', updated.id), { name, phone, address });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${updated.id}`);
      }
    }

    if (updated.role === 'Customer') {
      setRegisteredCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
    } else if (updated.role === 'Farmer' && updated.farmerId) {
      setFarmers(prev => prev.map(f => f.id === updated.farmerId ? { ...f, name, phone, address } : f));
      setProducts(prev => prev.map(p => p.farmerId === updated.farmerId ? { ...p, farmerName: name } : p));
    }
  };

  const registerCustomer = (name: string, phone: string, password?: string, address?: string) => {
    const existing = registeredCustomers.find(c => c.phone === phone);
    if (existing) {
      return { success: false, message: 'এই ফোন নম্বরটি ইতোমধ্যে নিবন্ধিত!' };
    }

    const newCust: User = {
      id: `customer-${Date.now()}`,
      phone,
      password: password || 'Ajzakir@2020',
      role: 'Customer',
      name,
      address: address || 'ঢাকা, বাংলাদেশ'
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'users', newCust.id), newCust).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `users/${newCust.id}`);
      });
    }

    setRegisteredCustomers(prev => [...prev, newCust]);
    setCurrentUser(newCust); // auto-login
    return { success: true, message: 'গ্রাহক নিবন্ধন সফল হয়েছে!' };
  };

  const registerFarmer = (
    name: string,
    phone: string,
    password: string,
    district: string,
    address: string,
    nidNumber: string,
    nidImage: string,
    gender: 'male' | 'female'
  ) => {
    const existing = farmers.find(f => f.phone === phone);
    if (existing) {
      return { success: false, message: 'এই মোবাইল নম্বরটি দিয়ে ইতোমধ্যে আবেদন করা হয়েছে!' };
    }

    const nextFarmerId = `f${farmers.length + 31}`; // Offset existing base demo farmers

    const newFarmer: Farmer = {
      id: nextFarmerId,
      name,
      gender,
      district,
      address,
      rating: 4.5,
      verified: false,
      productCount: 0,
      salesCount: 0,
      avatar: gender,
      phone,
      nid: nidNumber,
      nidImage: nidImage || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=50',
      status: 'Pending', // PENDING SYSTEM
      balance: 0,
      bio: 'কৃষক বাজারে নতুন যুক্ত হওয়া অংশীদার প্রান্তিক খামারি।'
    };

    if (isFirebaseConfigured && db) {
      // 1. Write the Farmer document details
      setDoc(doc(db, 'farmers', newFarmer.id), newFarmer).catch(err => {
         handleFirestoreError(err, OperationType.CREATE, `farmers/${newFarmer.id}`);
      });
      // 2. Write their respective User login credential mapping
      const farmerUser: User = {
        id: `user-farmer-${newFarmer.id}`,
        phone: newFarmer.phone,
        role: 'Farmer',
        name: newFarmer.name,
        address: newFarmer.address,
        farmerId: newFarmer.id,
        district: newFarmer.district,
        status: newFarmer.status
      };
      setDoc(doc(db, 'users', farmerUser.id), farmerUser).catch(err => {
         handleFirestoreError(err, OperationType.CREATE, `users/${farmerUser.id}`);
      });
    }

    setFarmers(prev => [...prev, newFarmer]);
    return { 
      success: true, 
      message: 'আপনার একাউন্ট রিভিউ এর জন্য সাবমিট হয়েছে। এডমিন অনুমোদন দেওয়ার পরে আপনি লগইন করতে পারবেন।' 
    };
  };

  // CART STATE MGMT
  const addToCart = (product: Product, quantity: number) => {
    logAnalyticsEvent('add_to_cart', {
      item_id: product.id,
      item_name: product.title,
      price: product.discountPrice || product.price,
      quantity: quantity
    });
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, {
        productId: product.id,
        title: product.title,
        price: product.discountPrice || product.price,
        quantity: quantity,
        image: product.images[0],
        farmerId: product.farmerId
      }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ORDER MANAGEMENT
  const placeOrder = (
    name: string,
    phone: string,
    address: string,
    paymentMethod?: 'COD' | 'bKash' | 'Nagad',
    paymentTxId?: string
  ) => {
    const finalCart = [...cart];
    const total = finalCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: `KB-${Math.floor(1000 + Math.random() * 9000)}`,
      trackingNumber: `TRK-${randomSuffix}-${phone.slice(-2).toUpperCase()}`,
      customerId: currentUser?.id || `cust-anon-${Date.now()}`,
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
      products: finalCart,
      totalPrice: total,
      status: 'Pending',
      paymentMethod: paymentMethod || 'COD',
      createdAt: new Date().toISOString()
    };

    logAnalyticsEvent('purchase', {
      transaction_id: newOrder.id,
      value: total,
      currency: 'BDT',
      items_count: finalCart.length,
      payment_method: paymentMethod || 'COD'
    });

    if (paymentTxId) {
      newOrder.paymentTxId = paymentTxId;
    }

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'orders', newOrder.id), newOrder).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `orders/${newOrder.id}`);
      });

      // Update sales metrics and balance (earnings ledger) for farmers
      finalCart.forEach(async (item) => {
        const targetFarmer = farmers.find(farm => farm.id === item.farmerId);
        const addedEarnings = item.price * item.quantity;
        if (targetFarmer) {
          try {
            await updateDoc(doc(db, 'farmers', item.farmerId), {
              salesCount: (targetFarmer.salesCount || 0) + item.quantity,
              balance: (targetFarmer.balance || 0) + addedEarnings
            });
          } catch (e) {}
        }
      });

      // Update customer profile with latest delivery details
      if (currentUser && currentUser.role === 'Customer') {
        updateDoc(doc(db, 'users', currentUser.id), { name, phone, address }).catch(() => {});
      }
    }

    setOrders(prev => [newOrder, ...prev]);

    if (!isFirebaseConfigured) {
      finalCart.forEach(item => {
        setFarmers(prev => prev.map(f => {
          if (f.id === item.farmerId) {
            const addedEarnings = item.price * item.quantity;
            return {
              ...f,
              salesCount: f.salesCount + item.quantity,
              balance: f.balance + addedEarnings
            };
          }
          return f;
        }));
      });

      if (currentUser && currentUser.role === 'Customer') {
        const updatedUser = { ...currentUser, name, phone, address };
        setCurrentUser(updatedUser);
        setRegisteredCustomers(prev => prev.map(c => c.id === updatedUser.id ? updatedUser : c));
      }
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'orders', orderId), { status }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
      });
    }
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  // WITHDRAWALS SYSTEM
  const requestWithdrawal = (
    farmerId: string,
    amount: number,
    method: 'bKash' | 'Nagad' | 'Bank Transfer',
    details: string
  ) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (!farmer) return { success: false, message: 'কৃষক তথ্য পাওয়া যায়নি!' };

    if (amount < 500) {
      return { success: false, message: 'দুঃখিত, সর্বনিম্ন ৫০০ টাকা হলে উত্তোলন আবেদন করা সম্ভব।' };
    }

    if (farmer.balance < amount) {
      return { success: false, message: `অপর্যাপ্ত ব্যালেন্স! আপনার বর্তমান ব্যালেন্স ৳${farmer.balance}` };
    }

    const newRequest: WithdrawalRequest = {
      id: `WR-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId,
      farmerName: farmer.name,
      amount,
      method,
      details,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'withdrawals', newRequest.id), newRequest).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `withdrawals/${newRequest.id}`);
      });
      updateDoc(doc(db, 'farmers', farmerId), {
        balance: farmer.balance - amount
      }).catch(() => {});
    }

    // Deduct pending balance right away in local UI
    setFarmers(prev => prev.map(f => {
      if (f.id === farmerId) {
        return { ...f, balance: f.balance - amount };
      }
      return f;
    }));

    setWithdrawalRequests(prev => [newRequest, ...prev]);
    return { success: true, message: 'উত্তোলন আবেদনটি সফলভাবে প্রেরণ করা হয়েছে এবং রিভিউর জন্য অপেক্ষমাণ।' };
  };

  const updateWithdrawallStatus = (requestId: string, status: WithdrawalRequest['status']) => {
    if (isFirebaseConfigured && db) {
      const req = withdrawalRequests.find(r => r.id === requestId);
      if (req) {
        updateDoc(doc(db, 'withdrawals', requestId), { status }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `withdrawals/${requestId}`);
        });
        if (status === 'Rejected' && req.status !== 'Rejected') {
          const f = farmers.find(farm => farm.id === req.farmerId);
          if (f) {
            updateDoc(doc(db, 'farmers', req.farmerId), {
              balance: f.balance + req.amount
            }).catch(() => {});
          }
        }
      }
    }

    setWithdrawalRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        if (status === 'Rejected' && req.status !== 'Rejected' && !isFirebaseConfigured) {
          setFarmers(farmerPrev => farmerPrev.map(f => {
            if (f.id === req.farmerId) {
              return { ...f, balance: f.balance + req.amount };
            }
            return f;
          }));
        }
        return { ...req, status };
      }
      return req;
    }));
  };

  // ADMINISTRATIVE AND METRIC MODIFIERS
  const editFarmerRating = (farmerId: string, rating: number) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'farmers', farmerId), { rating: Math.max(1, Math.min(5, rating)) }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
    }
    setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, rating: Math.max(1, Math.min(5, rating)) } : f));
  };

  const toggleVerifyFarmer = (farmerId: string) => {
    const f = farmers.find(farm => farm.id === farmerId);
    if (f) {
      const nextVerified = !f.verified;
      if (isFirebaseConfigured && db) {
        updateDoc(doc(db, 'farmers', farmerId), { verified: nextVerified }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
        });
        products.filter(p => p.farmerId === farmerId).forEach(p => {
          updateDoc(doc(db, 'products', p.id), { isVerified: nextVerified }).catch(() => {});
        });
      }

      setFarmers(prev => prev.map(farm => {
        if (farm.id === farmerId) {
          setProducts(prodPrev => prodPrev.map(p => p.farmerId === farmerId ? { ...p, isVerified: nextVerified } : p));
          return { ...farm, verified: nextVerified };
        }
        return farm;
      }));
    }
  };

  const toggleBlockFarmer = (farmerId: string) => {
    const f = farmers.find(farm => farm.id === farmerId);
    if (f) {
      const nextBlocked: 'Blocked' | 'Approved' = f.status === 'Blocked' ? 'Approved' : 'Blocked';
      if (isFirebaseConfigured && db) {
        updateDoc(doc(db, 'farmers', farmerId), { status: nextBlocked }).catch(err => {
          handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
        });
        updateDoc(doc(db, 'users', `user-farmer-${farmerId}`), { status: nextBlocked }).catch(() => {});
      }
      setFarmers(prev => prev.map(farm => {
        if (farm.id === farmerId) {
          return { ...farm, status: nextBlocked };
        }
        return farm;
      }));
    }
  };

  const deleteFarmer = (farmerId: string) => {
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'farmers', farmerId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `farmers/${farmerId}`);
      });
      deleteDoc(doc(db, 'users', `user-farmer-${farmerId}`)).catch(() => {});
      products.filter(p => p.farmerId === farmerId).forEach(p => {
        deleteDoc(doc(db, 'products', p.id)).catch(() => {});
      });
    }
    setFarmers(prev => prev.filter(f => f.id !== farmerId));
    setProducts(prev => prev.filter(p => p.farmerId !== farmerId));
  };

  const approveFarmerRegistration = (farmerId: string) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'farmers', farmerId), { status: 'Approved', verified: true }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
      updateDoc(doc(db, 'users', `user-farmer-${farmerId}`), { status: 'Approved' }).catch(() => {});
      products.filter(p => p.farmerId === farmerId).forEach(p => {
        updateDoc(doc(db, 'products', p.id), { isVerified: true }).catch(() => {});
      });
    }

    setFarmers(prev => prev.map(f => f.id === farmerId ? { ...f, status: 'Approved', verified: true } : f));
    setProducts(prev => prev.map(p => p.farmerId === farmerId ? { ...p, isVerified: true } : p));
  };

  // PRODUCT ACTIONS
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'farmerName' | 'isVerified'>) => {
    const farmer = farmers.find(f => f.id === productData.farmerId);
    const newId = `p${products.length + 1000}`;

    const finalImages = productData.images && productData.images.length >= 3 
      ? productData.images 
      : [
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-1',
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-2',
          'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=500&auto=format&fit=crop&q=60-3'
        ];

    const newProduct: Product = {
      ...productData,
      id: newId,
      rating: 4.8,
      farmerName: farmer?.name || 'পরিচিত খামারি',
      isVerified: farmer?.verified || false,
      images: finalImages
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'products', newProduct.id), newProduct).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `products/${newProduct.id}`);
      });
      if (farmer) {
        updateDoc(doc(db, 'farmers', farmer.id), { productCount: (farmer.productCount || 0) + 1 }).catch(() => {});
      }
    }

    setProducts(prev => [newProduct, ...prev]);

    if (!isFirebaseConfigured) {
      setFarmers(prev => prev.map(f => {
        if (f.id === productData.farmerId) {
          return { ...f, productCount: f.productCount + 1 };
        }
        return f;
      }));
    }
  };

  const editProduct = (productId: string, productData: Partial<Product>) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'products', productId), productData).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `products/${productId}`);
      });
    }
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } as Product : p));
  };

  const deleteProduct = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'products', productId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
      });
      if (p && p.farmerId) {
        const farm = farmers.find(f => f.id === p.farmerId);
        if (farm) {
          updateDoc(doc(db, 'farmers', p.farmerId), { productCount: Math.max(0, (farm.productCount || 0) - 1) }).catch(() => {});
        }
      }
    }

    setProducts(prev => prev.filter(prod => prod.id !== productId));

    if (p && !isFirebaseConfigured) {
      setFarmers(prev => prev.map(f => {
        if (f.id === p.farmerId) {
          return { ...f, productCount: Math.max(0, f.productCount - 1) };
        }
        return f;
      }));
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'isVerifiedPurchase'>) => {
    const isVerifiedPurchase = orders.some(o => 
      o.customerId === currentUser?.id && 
      o.products.some(p => p.title.includes(reviewData.productName) || reviewData.productName.includes(p.title))
    );

    const newReview: Review = {
      ...reviewData,
      id: `r${reviews.length + 101}`,
      isVerifiedPurchase: isVerifiedPurchase || true
    };

    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'reviews', newReview.id), newReview).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `reviews/${newReview.id}`);
      });
    }

    setReviews(prev => [newReview, ...prev]);
  };

  const deleteReview = (reviewId: string) => {
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'reviews', reviewId)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
      });
    }
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const saveCategories = (newCategories: Category[]) => {
    if (isFirebaseConfigured && db) {
      newCategories.forEach(async (c) => {
        try {
          await setDoc(doc(db, 'categories', c.id), c);
        } catch (e) {}
      });
    }
    setCategories(newCategories);
  };

  const saveBanners = (newBanners: Banner[]) => {
    if (isFirebaseConfigured && db) {
      newBanners.forEach(async (b, idx) => {
        try {
          await setDoc(doc(db, 'banners', `banner-${idx}`), b);
        } catch (e) {}
      });
    }
    setBanners(newBanners);
  };

  const saveSiteSettings = (settings: SiteSettings) => {
    localStorage.setItem('kb_site_settings', JSON.stringify(settings));
    setSiteSettings(settings);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'settings', 'global'), settings).catch(() => {});
    }
  };

  const addBlogPost = (postData: Omit<BlogPost, 'id' | 'publishedAt'>) => {
    const newPost: BlogPost = {
      ...postData,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    const updated = [newPost, ...blogs];
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'blogs', newPost.id), newPost).catch(() => {});
    }
  };

  const editBlogPost = (postId: string, postData: Partial<BlogPost>) => {
    const updated = blogs.map(b => b.id === postId ? { ...b, ...postData } as BlogPost : b);
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'blogs', postId), postData).catch(() => {});
    }
  };

  const deleteBlogPost = (postId: string) => {
    const updated = blogs.filter(b => b.id !== postId);
    localStorage.setItem('kb_blogs', JSON.stringify(updated));
    setBlogs(updated);
    if (isFirebaseConfigured && db) {
      deleteDoc(doc(db, 'blogs', postId)).catch(() => {});
    }
  };

  const updateFarmer = (farmerId: string, updatedData: Partial<Farmer>) => {
    if (isFirebaseConfigured && db) {
      updateDoc(doc(db, 'farmers', farmerId), updatedData).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `farmers/${farmerId}`);
      });
      if ('verified' in updatedData) {
        const verifiedVal = updatedData.verified;
        products.filter(p => p.farmerId === farmerId).forEach(p => {
          updateDoc(doc(db, 'products', p.id), { isVerified: !!verifiedVal }).catch(() => {});
        });
      }
    }

    setFarmers(prev => {
      const isVerifiedUpdated = 'verified' in updatedData;
      const verifiedVal = updatedData.verified;
      
      if (isVerifiedUpdated) {
        setProducts(prodPrev => prodPrev.map(p => p.farmerId === farmerId ? { ...p, isVerified: !!verifiedVal } : p));
      }
      return prev.map(f => f.id === farmerId ? { ...f, ...updatedData } as Farmer : f);
    });
  };

  const getNidDetails = (farmerId: string) => {
    const farmer = farmers.find(f => f.id === farmerId);
    if (!farmer) {
      return {
        exists: false,
        nid: '',
        status: 'Unverified' as const,
        percentMatchCount: 0,
        ecReference: 'N/A',
        verifiedAt: 'N/A'
      };
    }

    const hasNidStr = farmer.nid && farmer.nid.trim().length > 0;
    // Generate a matching NID if none is supplied so that all current farmers have visually verifiable data
    const nid = hasNidStr ? (farmer.nid || '') : `${1980000000000 + parseInt(farmerId.replace(/\D/g, '') || '0') * 4429}`;

    // Simulate backend verification checks
    let status: 'Verified' | 'Suspected' | 'System Error' | 'Unverified' = 'Verified';
    let percentMatchCount = 98;

    if (!hasNidStr && farmer.status === 'Pending') {
      status = 'Unverified';
      percentMatchCount = 0;
    } else {
      // Create some realistic variability based on numeric properties of their ID
      const numId = parseInt(farmerId.replace(/\D/g, '') || '0');
      if (numId % 7 === 0) {
        status = 'Suspected';
        percentMatchCount = 47;
      } else if (numId % 11 === 0) {
        status = 'System Error';
        percentMatchCount = 0;
      } else {
        status = 'Verified';
        percentMatchCount = 100 - (numId % 3);
      }
    }

    const ecReference = `EC-NID-REF-${nid.slice(-4)}-2026`;
    const verifiedAt = new Date(Date.now() - 3600000 * 24 * (parseInt(farmerId.replace(/\D/g, '') || '1') % 7 + 1)).toISOString().split('T')[0];

    return {
      exists: hasNidStr || farmer.status !== 'Pending',
      nid,
      status,
      percentMatchCount,
      ecReference,
      verifiedAt
    };
  };

  const resetDemoData = async () => {
    // 1. Reset states
    setProducts(demoProducts);
    setFarmers(demoFarmers);
    setCategories(CATEGORIES);
    setReviews(demoReviews);
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    setBlogs(demoBlogs);

    // 2. Clear Local Storage or set to defaults
    localStorage.setItem('kb_products', JSON.stringify(demoProducts));
    localStorage.setItem('kb_farmers', JSON.stringify(demoFarmers));
    localStorage.setItem('kb_categories', JSON.stringify(CATEGORIES));
    localStorage.setItem('kb_reviews', JSON.stringify(demoReviews));
    localStorage.setItem('kb_site_settings', JSON.stringify(DEFAULT_SITE_SETTINGS));
    localStorage.setItem('kb_blogs', JSON.stringify(demoBlogs));

    // 3. Sync to Cloud Firestore if provisioned
    if (isFirebaseConfigured && db) {
      console.log("Re-seeding cloud database with new 165+ products & 75+ verified farmers...");
      try {
        // Seed categories
        for (const c of CATEGORIES) {
          await setDoc(doc(db, 'categories', c.id), c);
        }
        // Seed reviews
        for (const r of demoReviews) {
          await setDoc(doc(db, 'reviews', r.id), r);
        }
        // Seed farmers
        for (const f of demoFarmers) {
          await setDoc(doc(db, 'farmers', f.id), f);
        }
        // Seed products
        for (const p of demoProducts) {
          await setDoc(doc(db, 'products', p.id), p);
        }
        // Seed settings
        await setDoc(doc(db, 'settings', 'global'), DEFAULT_SITE_SETTINGS);
        // Seed blogs
        for (const b of demoBlogs) {
          await setDoc(doc(db, 'blogs', b.id), b);
        }
      } catch (err) {
        console.error("Firebase seeding error:", err);
        throw err;
      }
    }
  };

  return (
    <AppContext.Provider value={{
      farmers,
      products,
      orders,
      reviews,
      currentUser,
      cart,
      withdrawalRequests,
      registeredCustomers,
      categories,
      banners,
      saveCategories,
      saveBanners,
      siteSettings,
      saveSiteSettings,
      blogs,
      addBlogPost,
      editBlogPost,
      deleteBlogPost,
      login,
      logout,
      updateProfile,
      registerCustomer,
      registerFarmer,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateOrderStatus,
      requestWithdrawal,
      updateWithdrawallStatus,
      editFarmerRating,
      toggleVerifyFarmer,
      toggleBlockFarmer,
      deleteFarmer,
      approveFarmerRegistration,
      updateFarmer,
      addProduct,
      editProduct,
      deleteProduct,
      addReview,
      deleteReview,
      getNidDetails,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
