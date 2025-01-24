import { collection, doc, getDoc, getCountFromServer } from "firebase/firestore";
import { db } from "@/config/firebase";

const CurrentEvent = async (): Promise<number> => {
  const eventsCollection = collection(db, 'events');
  const eventsSnapshot = await getCountFromServer(eventsCollection);

  const currentEvent = eventsSnapshot.data().count;

  return currentEvent - 1; // khong tinh so 0
}

const getDateEvent = async (eventId: string): Promise<string> => {
  const info = await getDoc(doc(db, 'events', eventId));
  const endDate = info.data()?.endDate ?? '2000-01-01T12:00:00';
  return endDate;
}

export { CurrentEvent, getDateEvent };
