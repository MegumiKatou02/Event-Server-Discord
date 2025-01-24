import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";

const CurrentEvent = async (): Promise<number> => {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getDocs(eventsCollection);

  const currentEvent = eventsSnapshot.docs.length;

  return currentEvent;
}

const getDateEvent = async (eventId: string): Promise<string> => {
  const info = await getDoc(doc(db, 'events', eventId));
  const endDate = info.data()?.endDate ?? '';
  return endDate;
}

export { CurrentEvent, getDateEvent };
