import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:4444',
    headers: {
        'content-type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
    },
});

const RecommendAPI = {

    getRecommendProduct: (formData) => {
        const url = `/detect`;
        return axiosClient.post(url, formData)
    },

}

export default RecommendAPI