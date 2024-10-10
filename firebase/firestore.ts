import { getFirestore, collection, addDoc, Firestore } from "firebase/firestore";
import app from "./app";

const db = getFirestore(app);

const schoolPath: string = "schoolData";

type SchoolData = {
    name: string;
    isATL: boolean;
    paidSubscription: boolean;
    address: {
        addressLine1: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    atlIncharge: {
        email: string;
        firstName: string;
        lastName: string;
        whatsappNumber: string;
    };
    principal: {
        email: string;
        firstName: string;
        lastName: string;
        whatsappNumber: string;
    },
    correspondent?: {
        email?: string;
        firstName?: string;
        lastName?: string;
        whatsappNumber?: string;
    },
    socialMediaLink: string[];
    syllabus: {
        cbse: boolean;
        icse: boolean;
        igcse: boolean;
        state: boolean;
        ib: boolean;
    },
    webSite: string;
    date: string;
}

const addSchool = async (schoolData: SchoolData) => {
    const ref = collection(db, schoolPath);
    await addDoc(ref, schoolData);
};

export { addSchool };
export default db;
export type School = SchoolData;
