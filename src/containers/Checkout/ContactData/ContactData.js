import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-order';
import Spinner from '../../../components/UI/Spinner/Spinner';

class ContactData extends Component {
    state ={
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    }
    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading:true});
        
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'aiiyan sinha',
                address: {
                    street: 'Teststreet 1',
                    zipcode: '800027',
                    country: 'India'
                },
                email: 'aiiyan.sinha14@gmail.com'
            },
            deliveryMethod: 'fastest'
        }
        axios.post('/orders.json',order)
            .then(res => {
                this.setState({loading: false});
                this.props.history.push('/');
            })
            .catch(err => {
                this.setState({loading: false})
            });
    }
    
    render( ){
        let form = (
            <form>
            <input type="text" name="name" placeholder="Your Name" />
            <input type="email" name="email" placeholder="Your Email" />
            <input type="text" name="street" placeholder="Street" />
            <input type="text" name="postal" placeholder="Postal Code" />
            <Button btnType="Success" clicked={this.orderHandler} >ORDER</Button>
        </form>
        );
        if(this.state.loading)
        {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter Your Contact Data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData