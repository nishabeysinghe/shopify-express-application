import React, { Component } from 'react';
import * as axios from 'axios';
import { Page, Button, Stack } from '@shopify/polaris';
import Loading from './Loading';
import CollapseMain from './CollapseMain';
import Uncollapsed from './Uncollapsed';
const QRCode = require('qrcode.react');

class Part2Cards extends Component {
    constructor() {
        super();
        this.state = {
            orders: [],
            products: {},
            isOrderListLoading: true,
            isExpanded: true
        };
        this.toggleCardType = this.toggleCardType.bind(this);
        this.resetOrders = this.resetOrders.bind(this);
    }


    toggleCardType() {
        this.setState({isExpanded: !this.state.isExpanded});
    }

    componentDidMount() {
        axios.get('/shopify/shop-api/products')
            .then(response => {
                const products = response.data.products;
                this.setState({ products: response.data.products });
            });
        axios.get('/shopify/shop-api/orders')
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    isOrderListLoading: false
                });
            });
    }

    resetOrders() {
        this.setState({
            isOrderListLoading: true
        });
        axios.get('/shopify/shop-api/orders')
            .then(response => {
                this.setState({
                    orders: response.data.orders,
                    isOrderListLoading: false
                });
            });
    }


    render() {

        let buttonText = this.state.isExpanded ? {text:"Switch to collapsed view"} : {text:"Switch to expanded view"}

        if (this.state.isOrderListLoading) {
            return <Loading />;
        }
        else {
            // All the order details
            var orders = this.state.orders;
            console.log(orders);

            var orderArray = [];
            orders.forEach((order) => {
                var items = order.line_items;
                var lineItems = [];
                items.forEach(item => {
                    lineItems.push({
                        id: item.id,
                        title: item.title,
                        quantity: item.quantity,
                        variant_title: item.variant_title,
                        product_id: item.product_id

                    });
                });
                const customer = order.customer.first_name + " " + order.customer.last_name;
                orderArray.push({
                    id: order.id,
                    order_number: order.order_number,
                    lineItems: lineItems,
                    customer: customer,
                    created_at: order.created_at.substring(0, 10)

                });
            });

            console.log(orderArray);

            return (
                <Page title="Unfulfilled Orders" separator>
                <Stack 
                     distribution="trailing"
                 >
                 <div style={{paddingBottom:10}}>
                 <Stack.Item>
                         <Button 
                             plain
                             size="slim" 
                             outline  
                             onClick={this.toggleCardType} 
                             style={{ marginBottom: '1rem' }}
                         >
                             {buttonText.text}
                         </Button>
                     </Stack.Item>
                 </div>
                     
                 </Stack>

                    {orderArray.map((order, index) => {
                        const qrValue = order.order_number.toString();
                        const title = "Order ID: " + order.order_number;

                        if(this.state.isExpanded){
                            return (
                                <Uncollapsed 
                                    key={index}
                                    order={order} 
                                    productsProp={this.state.products} 
                                    qrVal={qrValue} 
                                    title={title}
                                />
                       
                            );}else{
                                return (
                                    <CollapseMain 
                                        key={index} 
                                        order={order} 
                                        productsProp={this.state.products} 
                                        qrVal={qrValue} 
                                        title={title}
                                        resetOrders={this.resetOrders}
                                    />
                                );
                            }          
                               
                    })}

                </Page>
            );
        }
    }
}

export default Part2Cards;
