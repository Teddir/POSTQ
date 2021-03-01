import {removeToken, storeToken} from '../services/storage/Token';

const setUser = (user) => {
    console.log(user);
    return {
        type: 'SET_USER',
        data: user,
    };
};

const clearToken = () => {
    removeToken();
    return {
        type: 'CLEAR'
    };
};

const changeToken = (data) => {
    // console.log(data);
    data ? storeToken(data) : null;
    console.log('Storing to redux');
    return {
        type: 'CHANGE',
        data: data,
    };
};


export {setUser, clearToken, changeToken};
