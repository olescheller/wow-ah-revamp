import React from 'react';
import copperIcon from '../assets/Copper.png';
import silverIcon from '../assets/Silver.png';
import goldIcon from '../assets/Gold.png';
import './moneyView.css'

class MoneyView extends React.Component {

constructor(props) {
    super(props);
}

    renderMoney = () => {
        const label = this.props.label ? this.props.label : '';
        //100 money = 1 silver,  10.000 money = 1 gold
        const money = Math.floor(this.props.money);
        const gold = Math.floor(money/10000);
        const silver = Math.floor((money % 10000) / 100);
        const copper = (money % 10000) % 100;
        const coins = [];
        const goldItem = (<span key="gold">{gold} <img  src={goldIcon} alt="gold"/></span>);
        const silverItem = (<span key="silver">{silver} <img  src={silverIcon} alt="silver"/></span>);
        const copperItem = (<span key="copper">{copper} <img  src={copperIcon} alt="copper"/></span>);

        if(gold > 0 ) {coins.push(goldItem, silverItem, copperItem)}
        else if(silver > 0) {coins.push(silverItem, copperItem);}
        else {coins.push(copperItem);}
        return(
            <div className='coins'>{coins} {label}</div>
        )
    };

    render() {
        return (
            this.renderMoney()
        )
    }
}


export default MoneyView;

