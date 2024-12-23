import {getFirestore, collection, addDoc, updateDoc, DocumentReference, doc} from "firebase/firestore";
import app from "./app";
import TinkeringActivityCard from "@/app/(pages)/student-snapshot/components/TinkeringActivityCard";
import updateProps from "react-native-reanimated/lib/typescript/reanimated2/UpdateProps";

const db = getFirestore(app);

type user = {
    name: string;
    email: string;
    uid: string;
    role: string;
    chats?: {
        groupName: string;
        ref: DocumentReference;
    }[];
    tasks?: {
        taskName: string;
        taskDueDate: string;
        ref: DocumentReference;
    }[];
    notifications?: {
        title: string;
        body: string;
    }[];
    purchaseData?: {
        amount: string;
        doc: DocumentReference;
        merchantTransactionId: string;
        status: string;
        timestamp: string;
        type: string;
    }[];
}

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
    correspondent: {
        email: string;
        firstName: string;
        lastName: string;
        whatsappNumber: string;
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
    id?: string
}

type StudentData = {
    name: {
        firstName: string;
        lastName: string;
    },
    email: string;
    school: string;
    class: string;
    section: string;
    gender: string;
    isTeamLeader: boolean;
    aspiration: string;
    comments: string;
    id?: string;
}

type CompetitionData = {
    name: string;
    description: string;
    organizedBy: string;
    applicationStartDate: string;
    applicationEndDate: string;
    competitionStartDate: string;
    competitionEndDate: string;
    eligibility: {
        atlSchools: boolean;
        classesFrom: string;
        classesTo: string;
        individual: boolean;
        nonAtlSchools: boolean;
        team: boolean;
    };
    paymentDetails: {
        fee: string;
        type: string;
    };
    refLink: string[];
    requirements: string[];
    id?: string;
    status?: {
        modifiedAt: string;
        status: string;
    }[];
    path?: string;
}

type CourseData = {
    courseName: string;
    description: string;
    organizedBy: string;
    applicationStartDate: string;
    applicationEndDate: string;
    crsStartDate: string;
    crsEndDate: string;
    classesFrom: string;
    classesTo: string;
    refLink:string;
    courseTag: string[];
    requirements: string[];
    id?: string;
    status?: {
        modifiedAt: string;
        status: string;
    }[];
    path?: string;
}

type TinkeringActivityData = {
    taID: string;
    taName: string;
    subject: string;
    topic: string;
    subTopic: string;
    intro: string;
    goals: string[];
    materials: string[];
    instructions: string[];
    tips: string[];
    assessment: string[];
    extensions: string[];
    resources: string[];
    id?: string;
    status?: {
        modifiedAt: string;
        status: string;
    }[];
    path?: string;
}
type SessionData = {
    timestamp: string;
    duration: number;
    subject: string;
    topic: string;
    subTopic: string;
    type: string;
    paymentInfo?: {
        amount: number;
        status: string;
        merchantTransactionId: string;
    }
    paymentRequired?: boolean;
    prerequisites: string[];
    id?: string;
    status?: {
        modifiedAt: string;
        status: string;
    }[];
    path?: string;
}

type ChatData = {
    groupName: string;
    messages: {
        content: string;
        date: string;
        senderRef: DocumentReference;
        fileName?: string;
        fileURL?: string;
        time: string;
    }[];
    users: DocumentReference[];
    id?: string;
    path?: string;
}


type Task = {
    ref: string;
    taskDueDate: string;
    taskName: string;
    taskComments: string;
    taskDescription: string;
    taskDone: boolean;
    status?: { status: string; modifiedAt: string }[];



    users: DocumentReference[];
    id?: string;
    path?: string;

  }



const updateCompetition = async (competition: Competition) => {
    const { path, id, ...cleanedCompetition } = competition;
    const ref = doc(db, path || "");
    await updateDoc(ref, cleanedCompetition);
}

const updateTinkeringActivity = async (taData: TinkeringActivity) => {
    const { path, id, ...cleanedTAData } = taData;
    const ref = doc(db, path || "");
    await updateDoc(ref, cleanedTAData);
};

const updateCourse = async (course: Course) => {
    const { path, id, ...cleanedCourse } = course;
    const ref = doc(db, path || "");
    await updateDoc(ref, cleanedCourse);
}

const updateSession = async (session: Session) => {
    const { path, id, ...cleanedSession } = session;
    const ref = doc(db, path || "");
    await updateDoc(ref, cleanedSession);
}

const updateTaskActivity = async (tasksData: Taskactivity) => {
    const { path, id, ...cleanedTAData } = tasksData;
    const ref = doc(db, path || "");
    await updateDoc(ref, cleanedTAData);
};


export default db;
export { updateCompetition, updateTinkeringActivity, updateCourse, updateSession,updateTaskActivity };
export type User = user;
export type School = SchoolData;
export type Student = StudentData;
export type Competition = CompetitionData;
export type Course = CourseData;
export type TinkeringActivity = TinkeringActivityData;
export type Session = SessionData;
export type Chat = ChatData;
export type Taskactivity = Task;
