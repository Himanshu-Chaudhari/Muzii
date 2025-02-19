import axios from "axios";
import { getServerSession } from "next-auth";

export async function getUserStreams() {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    console.log("No email found in session");
    return [];
  }
  const email = session.user.email;

  try {
    const res  = await fetch(`/api/streams/my?creatorId=${email}`);
    const data = res.json()
    console.log(data); 
    return data; 
  } catch (error) {
    console.error("Error fetching user streams:", error);
    return [];
  }
}
export async function getAllActiveStreams() {
  try {
    const { data } = await axios.get('/api/streams');
    return data;
  } catch (error) {
    console.error("Error fetching active streams:", error);
    return [];
  }
}
