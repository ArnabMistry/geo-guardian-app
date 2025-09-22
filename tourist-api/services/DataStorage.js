import AsyncStorage from '@react-native-async-storage/async-storage';

export class DataStorage {
    static async storeFormData(step, data) {
        try {
            await AsyncStorage.setItem(`form_${step}`, JSON.stringify(data));
        } catch (error) {
            console.error('Error storing form data:', error);
        }
    }
    
    static async getFormData(step) {
        try {
            const data = await AsyncStorage.getItem(`form_${step}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting form data:', error);
            return null;
        }
    }
    
    static async getAllFormData() {
        try {
            const [kyc, trip, verification] = await Promise.all([
                this.getFormData('kyc'),
                this.getFormData('trip'),
                this.getFormData('verification')
            ]);
            
            return { kyc, trip, verification };
        } catch (error) {
            console.error('Error getting all form data:', error);
            return {};
        }
    }
    
    static async clearFormData() {
        try {
            await AsyncStorage.multiRemove(['form_kyc', 'form_trip', 'form_verification']);
        } catch (error) {
            console.error('Error clearing form data:', error);
        }
    }
}