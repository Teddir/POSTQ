import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
    View, 
    Text, 
    StatusBar, 
    TouchableOpacity, 
    ScrollView, 
    RefreshControl, 
    Image, 
    TextInput, 
    ToastAndroid, 
    TouchableWithoutFeedback,
    Modal,
    Button
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';

import ButtonView from '../../components/ButtonView';
import InputView2 from '../../components/InputView2';
import { getKategori } from '../../services/endpoint/kategori';
import { getProduk } from '../../services/endpoint/produk';
import { styles, colors } from '../../style';

const index = () => {
    const navigation = useNavigation();
    const [ loading, setLoading ] = useState(false);
    const { user, produk, listKategori } = useSelector((state) => state)
    const [modal, setModal] = useState(false);         //-----------------------> scanner modal
    const [scanItem, setScanItem] = useState('');  
    const [scanType, setScanType] = useState('item');
    const [uid, setUid] =useState(null);
    
    console.log('Produk ', produk.dataProduk ? 'ada' : 'tidak ada produk');  
    
    const getData = () => {
        getProduk();
        getKategori();
    }
    useEffect(() => {
        const unsub = navigation.addListener('focus', () => {
            getData();
        });
        return unsub;
    }, [navigation]);

    const toPrice = (price) => {
        return _.replace(price, /\B(?=(\d{3})+(?!\d))/g, '.');
    }

    const onScanSuccess = e => {
        // console.log(e)
        if (scanType === 'item') {
            setUid(e.data)
            setModal(false);
            setScanItem(e);
        } else {
            setModal(false);
        }
    };

    return (
        <>
        <View style={[styles.flex1, styles.backgroundLight]}>
            <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
                <View style={[styles.underCross, styles.marginVs]}>
                    <View style={[ styles.marginHm ]}>
                        <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                        <Icon1 name="dehaze" size={24}/>
                        </TouchableWithoutFeedback>
                    <View style={[styles.row, styles.marginVs, styles.centerItem, ]}>
                        <Icon name="text-box-search-outline" size={25}/>
                        <TextInput 
                        placeholder="Cari produk di semua kategori"

                        />
                    </View>
                </View>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl 
                    refreshing={produk?.dataProduk?.length > 0 ? produk.dataProduk.loading : null}
                    onPress={() => {
                        getData();
                    }}
                    />
                }
            >
            { user && produk?.dataProduk?.length > 0 ? (
                <>
                {produk.dataProduk ? (
                    <>
                    <View>
                        {produk.dataProduk.map((produk) => {
                            return (
                                <View
                                key={produk.id}
                                style={[
                                    styles.row,
                                ]}
                                >
                                    <View style={[
                                        styles.flex1,
                                        styles.underCross,
                                        styles.marginHm, 
                                    ]}>
                                        <TouchableOpacity>
                                        <View 
                                        style={[
                                            styles.marginMini,
                                            styles.row,
                                            styles.centerItem,
                                        ]}>
                                            <Image 
                                            source={{uri: produk.avatar}}
                                            style={[styles.img, styles.marginHs]}
                                            />
                                            <Text>
                                            {produk.name}{'\n'}
                                            {produk.stok ? (
                                                <>
                                                <Text style={{color: 'red', fontSize: 10}}>{produk.stok} Stok</Text>
                                                </>
                                            ): <Text>-</Text>}
                                            </Text>
                                            <View
                                            style={[
                                                styles.flex1,
                                                styles.marginVm,
                                                styles.textRight
                                            ]}>
                                                <Text>Rp.{toPrice(produk.hj)},-</Text>
                                            </View>
                                        </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                    </>
                ): loading}
                </>
            ): null}
            <View style={[styles.flex1, styles.marginHxl]}>
                <View style={[styles.marginButton, {marginBottom: 50}]}>
                    <ButtonView
                    title="Tambah Produk"
                    onPress={() => {navigation.navigate('ProdukInScreen')}}
                    />
                </View>
            </View>
            </ScrollView>
            <View style={[styles.flex1, styles.centerItem]}/>
            <View style={[styles.lingkaran, styles.backgroundPrimary]}>
            <TouchableOpacity onPress={() => setModal(true)}>
                <View style={[styles.centerItem]}>
                    <Icon name="barcode-scan" size={25} color={colors.white}/>
                </View>
            </TouchableOpacity>
            </View>
            <Modal onRequestClose={() => setModal(false)} visible={modal}>
            <QRCodeScanner
                vibrate
                showMarker
                reactivate
                reactivateTimeout={5000}
                onRead={onScanSuccess}
                topContent={
                <Text >
                    your computer and scan the QR code.
                </Text>
                }
                bottomContent={
                <TouchableOpacity onPress={() => setModal(false)}>
                    <Text >Scan { scanType === 'item' ? 'barang' : null } </Text>
                </TouchableOpacity> 
                }
            />
            </Modal>
        </View>
        </>
    )
}

export default index
