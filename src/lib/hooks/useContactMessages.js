import { databases, ID } from '../context/dbhandler';

export const useContactMessages = async (sender_email, message) => {
    try {
        console.log('sender_email', sender_email);
        console.log('message', message);


        const res = await databases.createDocument(
            import.meta.env.VITE_DATABASE,
            import.meta.env.VITE_MESSAGES,
            ID.unique(),
            {
                sender_email: sender_email,
                message: message
            }
        )
        console.log('Message sent successfully!:', res);
        return res;
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
