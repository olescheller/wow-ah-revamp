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
        //100 money = 1 silver,  10.000 money = 1 gold
        const money = this.props.money;
        const gold = Math.floor(money/10000);
        const silver = Math.floor((money % 10000) / 100);
        const copper = (money % 10000) % 100;
        const coins = [];
        const goldItem = (<span>{gold} <img  src={goldIcon} alt="gold"/></span>);
        const silverItem = (<span>{silver} <img  src={silverIcon} alt="silver"/></span>);
        const copperItem = (<span>{copper} <img  src={copperIcon} alt="copper"/></span>);

        if(gold > 0 ) {coins.push(goldItem, silverItem, copperItem)}
        else if(silver > 0) {coins.push(silverItem, copperItem);}
        else {coins.push(copperItem);}
        return(
            <div id='coins'>{coins}</div>
        )
    };

    render() {
        return (
            this.renderMoney()
        )
    }
}


export default MoneyView;

