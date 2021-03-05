import React, { Component } from 'react';
import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/Ordersummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-order';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients : null,
        totalprice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false

    }
    componentDidMount () {
        console.log(this.props);
        axios.get('https://react-my-burger-c8d97-default-rtdb.firebaseio.com/ingredients.json')
            .then(res => {
                this.setState({ingredients: res.data});
            })
    }

    updatePurchaseState (ingredients) {
        
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce( (sum, el) => {
                return sum + el;
            } ,0);
        this.setState({purchaseable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceAddition = INGREDIENT_PRICES[type];
        const oldprice = this.state.totalprice;
        const newPrice = oldprice + priceAddition;
        
        this.setState({totalprice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0)
            return;
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = updatedCount;

        const priceDeduction = INGREDIENT_PRICES[type];
        const oldprice = this.state.totalprice;
        const newPrice = oldprice - priceDeduction;
        
        this.setState({totalprice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
        this.setState({purchasing: true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }
    
    purchaseContinueHandler = () => {
        //alert('You continue')

        

        const queryParams = [];
        for(let i in this.state.ingredients){
            queryParams.push(encodeURIComponent(i) + "=" + encodeURIComponent(this.state.ingredients[i]) )
        }
        queryParams.push('price=' + this.state.totalprice)
        const queryString = queryParams.join('&');
        this.props.history.push({
            pathname: '/checkout',
            search: '?' + queryString
        });
    }

    render(){
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;


        let burger = <Spinner />

        if(this.state.ingredients)
        {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls 
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientRemove = {this.removeIngredientHandler}
                        disabled = {disabledInfo}
                        purchaseable={this.state.purchaseable}
                        ordered={this.purchaseHandler}
                        price = {this.state.totalprice}
                    />
                </Aux>
            )
            orderSummary = 
                <OrderSummary 
                    ingredients={this.state.ingredients} 
                    price={this.state.totalprice}
                    purchaseCancled={this.purchaseCancelHandler}
                    purchaseContinued={this.purchaseContinueHandler}
                />
        }
        if(this.state.loading) {
            orderSummary = <Spinner />;
        }
        
        
        //{ salad : true, meat : false } --------> if true then disable
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler} >
                   {orderSummary} 
                </Modal>
                    {burger}
            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);