import React, {useCallback, useEffect, useState} from 'react';
import './ProductList.css'
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";

const products = [
    {id: '1', title: 'Jeans', price: 5000, description: 'Color blue, straight'},
    {id: '2', title: 'Jacket', price: 12000, description: 'Color green, warm'},
    {id: '3', title: 'Jeans 2', price: 5000, description: 'Color blue, straight'},
    {id: '4', title: 'Jacket 8', price: 122, description: 'Color green, warm'},
    {id: '5', title: 'Jeans 3', price: 5000, description: 'Color black, straight'},
    {id: '6', title: 'Jacket 7', price: 600, description: 'Color blue, warm'},
    {id: '7', title: 'Jeans 4', price: 5500, description: 'Color blue, straight'},
    {id: '8', title: 'Jacket 5', price: 12000, description: 'Color yellow, warm'},

]

const getTotalPrice = (items) => {
    return items.reduce((acc, item) => {
        return acc += item.price;
    }, 0)
}

const ProductList = ({product}) => {

    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();


    const onSendData = useCallback(() => {

        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)

        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id)
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show()
            tg.MainButton.setParams({
                text: `Buy ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;