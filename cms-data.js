/**
 * Infinity Classes — Firebase Data Store
 * Firestore-based persistent database
 * Seeds all existing website content on first load if Firestore is empty
 */

import { db, storage } from './firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    serverTimestamp,
    deleteField
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

(function() {
    'use strict';

    // ════════════════════════════════════════════
    //  SEED DATA — All existing website content
    // ════════════════════════════════════════════

    var SEED = {
        site_settings: {
            general: {
                heroLine1: "Where Every Student's",
                heroLine2: "Best Version",
                heroLine3: "Takes Shape.",
                heroSubheadline: "Pune's most trusted coaching foundation for Classes 8\u201312 covering CBSE, State Board, JEE Mains, and MHT-CET disciplines.",
                locationBadge: "Pimpri Chinchwad, Pune",
                institute_name: "Infinity Classes Pune",
                contact_email: "",
                phone: "+91 75585 11338",
                address: "Sundarmoti, Chinchwad Gaon, Pimpri Chinchwad, Pune \u2013 411033",
                timings: "Mon\u2013Sat: 9AM\u20138PM | Sun: 9AM\u201311AM",
                youtubeVideoId: "aYmI0tIK9J4",
                whatsappUrl: "https://wa.me/919960811338",
                instagramUrl: "https://www.instagram.com/infinityclassespune/",
                youtubeUrl: "https://www.youtube.com/@VokeMath"
            }
        },
        enroll_form_config: {
            config: {
                formHeading: "Reserve a Seat. See the Difference Yourself.",
                formSubheading: "Limited seats available per batch. Secure your spot today.",
                submitButtonText: "Book My Free Demo",
                classOptions: ["8th Standard","9th Standard","10th Standard","11th Standard","12th Standard","JEE Mains","MHT-CET"],
                boardOptions: ["CBSE","State Board","Both / General"],
                timeOptions: ["Morning 9\u201311AM","Evening 4\u20137PM"]
            }
        },
        courses: [
            { _orig_id:'c1', title:'8th Standard', board:'CBSE', tags:['CBSE'], description:'Building a strong foundational framework in Science and Mathematics early on for future academic success.', icon:'fa-book-open', order:1, active:true },
            { _orig_id:'c2', title:'9th Standard', board:'CBSE', tags:['CBSE'], description:'Bridging the gap to major board exams with meticulous detail and comprehensive concept clarity.', icon:'fa-book-open', order:2, active:true },
            { _orig_id:'c3', title:'10th Standard', board:'CBSE', tags:['CBSE'], description:'Intensive board exam preparation backed by complete syllabus coverage and rigorous weekly test series.', icon:'fa-trophy', order:3, active:true },
            { _orig_id:'c4', title:'11th Standard', board:'PCM', tags:['PCM'], description:'Expert analytical guidance carefully tailored for respective boards to ensure a smooth transition to higher secondary.', icon:'fa-microscope', order:4, active:true },
            { _orig_id:'c5', title:'12th Standard', board:'PCM', tags:['PCM'], description:'Premium coaching strategies focused entirely on maximizing board exam output and achieving top percentages.', icon:'fa-graduation-cap', order:5, active:true },
            { _orig_id:'c6', title:'JEE Mains', board:'11th & 12th, Droppers', tags:['11th & 12th','Droppers'], description:'Strategic, robust competitive prep for aspiring engineers armed with advanced problem-solving techniques.', icon:'fa-bolt', order:6, active:true },
            { _orig_id:'c7', title:'MHT-CET', board:'11th & 12th, Droppers', tags:['11th & 12th','Droppers'], description:'Highly targeted approach optimizing speed and accuracy for Maharashtra state-level admissions.', icon:'fa-rocket', order:7, active:true },
            { _orig_id:'c8', title:'MHT-CET Crash Course', board:'11th & 12th, Droppers', tags:['11th & 12th','Droppers'], description:'Intensive, short-term prep program designed to quickly boost your score and exam readiness.', icon:'fa-bolt', order:8, active:true }
        ],
        faculty: [
            { _orig_id:'f1', name:'Sukrut Shinde', role:'Director & Founder', subject:'Science & Maths', experience:'10+ years', bio:'With over a decade of hands-on teaching experience, Sukrut Sir holds a distinctive capability to deconstruct complex conceptual hurdles, ensuring crystal-clear understanding and unwavering student confidence.', photoUrl:'', order:1 },
            { _orig_id:'f2', name:'Pratibha Shinde', role:'Biology & Chemistry Expert', subject:'Biology & Chemistry', experience:'8+ years', bio:'A passionately driven educator who translates dense biological processes into intuitive maps and makes organic chemistry predictably logical for rigorous board examinations and medical entrances.', photoUrl:'', order:2 }
        ],
        results: [
            { _orig_id:'r1', studentName:'Pooja Patil', initials:'PP', exam:'CBSE 10th', year:'2024', score:'95%', rank:'', photoUrl:'', order:1 },
            { _orig_id:'r2', studentName:'Ishaan Mahamuni', initials:'IM', exam:'CBSE 10th', year:'2024', score:'93%', rank:'', photoUrl:'', order:2 },
            { _orig_id:'r3', studentName:'Saniya Raut', initials:'SR', exam:'State Board 12th', year:'2024', score:'92%', rank:'', photoUrl:'', order:3 },
            { _orig_id:'r4', studentName:'Aryan Deshmukh', initials:'AD', exam:'JEE Mains', year:'2024', score:'98 PR', rank:'', photoUrl:'', order:4 },
            { _orig_id:'r5', studentName:'Neha Kulkarni', initials:'NK', exam:'MHT-CET', year:'2023', score:'99.1 %ile', rank:'', photoUrl:'', order:5 }
        ],
        testimonials: [
            { _orig_id:'t1', reviewerName:'Priya Kulkarni', reviewerRole:'Parent of 10th CBSE student', review:'My daughter improved significantly in Maths and Science after joining Infinity Classes. The teachers are patient and the batch sizes are small enough that she gets individual attention. Highly recommend to any parent in Chinchwad.', stars:5, order:1, active:true },
            { _orig_id:'t2', reviewerName:'Rahul Deshmukh', reviewerRole:'Parent of 12th student', review:'Sukrut sir and the team are genuinely committed. My son cleared his 12th boards with distinction. What stood out was how they track each student\'s progress and keep parents updated regularly.', stars:5, order:2, active:true },
            { _orig_id:'t3', reviewerName:'Sneha Joshi', reviewerRole:'Student, JEE Aspirant', review:'The JEE preparation here is structured and the faculty actually makes difficult concepts feel approachable. The study material is comprehensive and the doubt sessions after class are really helpful.', stars:5, order:3, active:true }
        ],
    gallery: [
            { _orig_id:'g1', label:'Classroom Sessions', images:[], icon:'fa-chalkboard-teacher', order:1, active:true },
            { _orig_id:'g2', label:'Result Celebrations', images:[], icon:'fa-award', order:2, active:true },
            { _orig_id:'g3', label:'Doubt Clearing Sessions', images:[], icon:'fa-question-circle', order:3, active:true },
            { _orig_id:'g4', label:'Annual Day', images:[], icon:'fa-calendar-alt', order:4, active:true },
            { _orig_id:'g5', label:'Career Guidance', images:[], icon:'fa-users', order:5, active:true },
            { _orig_id:'g6', label:'Student Achievements', images:[], icon:'fa-medal', order:6, active:true }
        ],
        updates: [
            { _orig_id:'u1', title:'New Batch Starting', date:'April 2025', body:'JEE & MHT-CET batch enrollments are now open. Limited seats per batch to ensure personal attention and focused mentoring throughout the academic year.', icon:'far fa-calendar-alt', order:1, active:true },
            { _orig_id:'u2', title:'Board Exam Tips', date:'March 2025', body:'Special revision series scheduled for 10th & 12th State Board & CBSE students. Attendance is highly encouraged for optimal retention strategies.', icon:'fas fa-bullhorn', order:2, active:true },
            { _orig_id:'u3', title:'Results Out', date:'May 2025', body:'Infinity Classes students shine exceptionally in the recent board results! Official felicitation ceremony schedule to follow shortly.', icon:'fas fa-trophy', order:3, active:true }
        ]
    };

    /** seedIfNeeded — populates Firestore if it's currently empty */
    async function seedIfNeeded() {
        const snap = await getDocs(collection(db, 'courses'));
        
        // Migration Check: Handle legacy gallery documents (convert imageUrl string to images array)
        if (!snap.empty) {
            const gallerySnap = await getDocs(collection(db, 'gallery'));
            for (const d of gallerySnap.docs) {
                const data = d.data();
                // ONLY migrate if we have the old field AND the new field is missing
                if (data.imageUrl !== undefined && data.images === undefined) {
                    const updates = { 
                        images: data.imageUrl ? [data.imageUrl] : [],
                        imageUrl: deleteField() // Permanently remove legacy field
                    };
                    await updateDoc(doc(db, 'gallery', d.id), updates);
                    console.log(`[CMS] Migrated legacy gallery tile: ${d.id}`);
                }
            }
            return; 
        }

        console.log('[CMS] Seeding Firestore with initial data...');
        // ... rest of seeding logic ...

        // 1. Seed site_settings
        for (let docId in SEED.site_settings) {
            await setDoc(doc(db, 'site_settings', docId), SEED.site_settings[docId]);
        }

        // 2. Seed enroll_form_config
        for (let docId in SEED.enroll_form_config) {
            await setDoc(doc(db, 'enroll_form_config', docId), SEED.enroll_form_config[docId]);
        }

        // 3. Seed Array-based collections
        const colNames = ['courses', 'faculty', 'results', 'testimonials', 'gallery', 'updates'];
        for (let colName of colNames) {
            for (let item of SEED[colName]) {
                const data = Object.assign({}, item);
                delete data._orig_id;
                data.created_at = serverTimestamp();
                data.updated_at = serverTimestamp();
                await addDoc(collection(db, colName), data);
            }
        }
        console.log('[CMS] Seeding complete.');
    }

    // ════════════════════════════════════════════
    //  CMS API — Real Firestore Implementation
    // ════════════════════════════════════════════

    window.CMS = {

        timestamp: serverTimestamp,

        /** getAll — mimics getDocs() QuerySnapshot */
        getAll: async function(collName, opts) {
            opts = opts || {};
            let q = collection(db, collName);

            // Simple direct where filter (mock matching)
            if (opts.where) {
                const constraints = [];
                for (let k in opts.where) {
                    constraints.push(where(k, "==", opts.where[k]));
                }
                q = query(q, ...constraints);
            }

            // Order By
            if (opts.orderBy) {
                q = query(q, orderBy(opts.orderBy, opts.orderDir || 'asc'));
            }

            const querySnapshot = await getDocs(q);
            
            // Add custom wrapper to match the old mock's data() wrapping for dates
            return {
                empty: querySnapshot.empty,
                size: querySnapshot.size,
                forEach: function(fn) {
                    querySnapshot.forEach(docSnap => {
                        fn({
                            id: docSnap.id,
                            data: function() {
                                const d = docSnap.data();
                                // Ensure Timestamp objects exist if they are raw numbers (for edge case safety)
                                if (d.submittedAt && typeof d.submittedAt === 'number') {
                                    const ts = d.submittedAt;
                                    d.submittedAt = { toDate: () => new Date(ts) };
                                }
                                return d;
                            }
                        });
                    });
                }
            };
        },

        /** get — mimics getDoc() DocumentSnapshot */
        get: async function(collName, docId) {
            const docRef = doc(db, collName, docId);
            const docSnap = await getDoc(docRef);
            return docSnap;
        },

        /** add — mimics addDoc() */
        add: async function(collName, itemData) {
            const data = Object.assign({}, itemData);
            data.created_at = serverTimestamp();
            data.updated_at = serverTimestamp();
            const docRef = await addDoc(collection(db, collName), data);
            return { id: docRef.id };
        },

        /** update — mimics updateDoc() */
        update: async function(collName, docId, updates) {
            const data = Object.assign({}, updates);
            data.updated_at = serverTimestamp();
            const docRef = doc(db, collName, docId);
            await updateDoc(docRef, data);
        },

        /** remove — mimics deleteDoc() */
        remove: async function(collName, docId) {
            const docRef = doc(db, collName, docId);
            await deleteDoc(docRef);
        },

        /** set — mimics setDoc() */
        set: async function(collName, docId, docData, opts) {
            const docRef = doc(db, collName, docId);
            await setDoc(docRef, docData, opts);
        },

        /** uploadImage — Real Firebase Storage Upload (Works on Spark/Free & Blaze) */
        uploadImage: async function(file) {
            if (!file) throw new Error('No file provided');
            try {
                // Create a unique filename with timestamp (handle Blob objects which don't have .name)
                const safeName = (file.name || 'upload.jpg').replace(/[^a-zA-Z0-9.]/g, '_');
                const filename = `${Date.now()}_${safeName}`;
                const storageRef = ref(storage, `uploads/${filename}`);
                
                // Upload the file
                const snapshot = await uploadBytes(storageRef, file);
                
                // Get the public download URL
                const downloadURL = await getDownloadURL(snapshot.ref);
                return downloadURL;
            } catch (err) {
                console.error('[CMS] Storage upload failed:', err);
                // Fallback for extreme cases (not recommended for production gallery)
                return new Promise(function(resolve, reject) {
                    var reader = new FileReader();
                    reader.onload = function(e) { resolve(e.target.result); };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
        },

        /** count - approximate count via getAll().size */
        count: async function(collName) {
            const snap = await getDocs(collection(db, collName));
            return snap.size;
        }
    };

    // Auto-seed on first load
    seedIfNeeded().then(() => {
        console.log('%c[CMS] Live Firestore Sync Active', 'color:#1565C0;font-weight:bold');
    });

})();
