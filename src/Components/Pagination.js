import {useCallback, useEffect, useState} from "react"
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from "react-native"
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import {Blue} from "../colors"

export default ({data = [], Item}) => {

    const [initialState, setInitialState] = useState({
        entries: 10,
        page: 1,
        pages: null,
        paginationData: []
    })

    const {entries, page, pages, paginationData} = initialState

    useEffect(() => {
        if(data.length > 0){
            const addRango = data.map((x,i,a) => ({...x, rango: i + 1}))
            const newData = addRango.filter(x => x.rango > ((page - 1) * entries) && x.rango <= (page * entries))
            const isDecimal = String(addRango.length / entries).includes('.')
            const split = String(addRango.length / entries).split('.')
            setInitialState({ ...initialState, paginationData: newData, pages: isDecimal ? parseInt(split[1]) < 5 ? (Math.round(addRango.length / entries)) + 1 : Math.round(addRango.length / entries) : Math.round(addRango.length / entries)})
        }
    }, [data, page])

    const handleStartPage = useCallback(() => setInitialState({...initialState, page: 1}))
    const handleEndPage = useCallback(() => setInitialState({...initialState, page: pages}))
    const handleNextPage = useCallback(() => setInitialState({...initialState, page: (page + 1)}))
    const handleBackPage = useCallback(() => setInitialState({...initialState, page: (page - 1)}))

    const Footer = () => {
        return(
            <View style={styles.paginationContainer}>
                <View style={styles.pagination}>
                    {/* flecha de regreso */}
                    <TouchableOpacity
                        onPress={() => page > 1 ? handleBackPage() : {}}
                        disabled={page === 1 ? true : false}
                        style={styles.directionContainer}
                    >
                        <View style={[styles.pageButton, {backgroundColor: page === 1 ? '#f1f1f1' : '#fff'}]}>
                            <Material name={'chevron-left'} size={24} color={'#adadad'} />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.paginationCenter}>
                        {/* Esta es para ir a la pagina 1 */}
                        {
                            page > 2
                            &&
                                <TouchableOpacity
                                    onPress={() => page > 1 ? handleStartPage() : {}}
                                    style={styles.pageButton}
                                >
                                    <Text style={styles.titleButton}>1</Text>
                                </TouchableOpacity>
                        }

                        {/* Este boton es para los 3 puntitos */}
                        {
                            page > 3
                            &&
                                <View style={styles.pageButton}>
                                    <Material name={'dots-horizontal'} size={18} color={'#ADADAD'}/>
                                </View>
                        }

                        {/* Este boton es para regresar una anterior */}
                        {
                            page > 1
                            &&
                                <TouchableOpacity 
                                    onPress={() => handleBackPage()}
                                    style={styles.pageButton}>
                                    <Text style={styles.titleButton}>{page - 1}</Text>
                                </TouchableOpacity>
                        }

                        {/* Este boton es para la pagina actual */}
                        <View
                            style={[styles.pageButton, {backgroundColor: Blue}]}>
                            <Text style={[styles.titleButton, {color: '#FFF'}]}>{page}</Text>
                        </View>

                        {/* Este boton es para la pagina siguiente a la actual */}
                        {
                            page <= (pages - 1)
                            &&
                                <TouchableOpacity 
                                    onPress={() => handleNextPage()}
                                    style={styles.pageButton}>
                                    <Text style={styles.titleButton}>{page + 1}</Text>
                                </TouchableOpacity>
                        }
                        
                        {/* Este boton es para las intermedias de la derecha */}
                        {
                            page < (pages - 2)
                            &&
                                <View style={styles.pageButton}>
                                    <Material name={'dots-horizontal'} size={18} color={'#ADADAD'}/>
                                </View>
                        }

                        {/* Este es el de la ultima pagina */}
                        {
                            page < (pages - 1)
                            &&
                                <TouchableOpacity 
                                    onPress={() => handleEndPage()}
                                    style={styles.pageButton}>
                                    <Text style={styles.titleButton}>{pages}</Text>
                                </TouchableOpacity>
                        }
                    </View>
                    <TouchableOpacity
                        onPress={() => page < pages ? handleNextPage() : {}}
                        disabled={page === pages ? true : false}
                        style={styles.directionContainer}
                    >
                        <View style={[styles.pageButton, {backgroundColor: page === pages ? '#f1f1f1' : '#fff'}]}>
                            <Material name={'chevron-right'} size={24} color={'#adadad'} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return(
        <View style={styles.container}>
            <FlatList 
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                data={paginationData}
                numColumns={1}
                keyExtractor={item => item.id}
                renderItem={({item}) => <Item page={page} {...item}/>}
            />
            <View style={styles.footer}>
                <Footer />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        height: 'auto',
        alignSelf: 'stretch',
        marginHorizontal: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 25,
        left: 0,
        right: 0
    },
    paginationContainer: {
        height: 'auto',
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pagination: {
        height: 50,
        width: '80%',
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#DADADA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 6
    },
    directionContainer: {
        height: '100%',
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pageButton: {
        height: '100%',
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    paginationCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    titleButton: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#ADADAD'
    }
})