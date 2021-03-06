import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import classes from './ContactData.css'
import axios from '../../../axios-orders'
import { FormElementBuilder } from '../../../helpers/form'
import withErrorHandler from '../../../hoc/withErrorHandler'
import * as actions from '../../../store/actions'

class ContactData extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      address: {
        street: '',
        postalCode: '',
      },
      orderForm: {
        deliveryMethod: new FormElementBuilder()
          .setElementType('select')
          .addConfig({
            name: 'deliveryMethod',
            options: [
              { value: 'fastest', displayValue: 'Fastest' },
              { value: 'cheapest', displayValue: 'Cheapest' },
            ],
          })
          .addValue('fastest')
          .build(),

        email: new FormElementBuilder()
          .addConfig({
            type: 'email',
            name: 'email',
            placeholder: 'Your E-mail',
          })
          .addValidation({ required: true })
          .build(),

        name: new FormElementBuilder()
          .addConfig({
            name: 'name',
            type: 'text',
            placeholder: 'Your Name',
          })
          .addValidation({ required: true })
          .build(),

        street: new FormElementBuilder()
          .addConfig({
            name: 'street',
            type: 'text',
            placeholder: 'Street',
          })
          .addValidation({ required: true })
          .build(),
        zipCode: new FormElementBuilder()
          .addConfig({
            name: 'postal',
            type: 'number',
            placeholder: 'Postal Code',
          })
          .addValidation({ required: true, minLength: 5, maxLength: 5 })
          .build(),
      },
      formIsValid: false,
    }
  }

  orderHandler = (event) => {
    event.preventDefault()
    const formData = {}
    for (let formElementIdentifier in this.state.orderForm) {
      formData[formElementIdentifier] = this.state.orderForm[
        formElementIdentifier
      ].value
    }
    const order = {
      ingredients: this.props.ings,
      price: this.props.price,
      orderData: formData,
    }

    this.props.onOrderBurger(order)
  }

  inputChangedHandler = (event, formElementKey) => {
    const updatedOrderForm = { ...this.state.orderForm }
    const updatedFormElement = { ...updatedOrderForm[formElementKey] }
    updatedFormElement.value = event.target.value
    updatedFormElement.valid = this.checkValidity(
      event.target.value,
      updatedFormElement.validation
    )
    updatedFormElement.touched = true
    updatedOrderForm[formElementKey] = updatedFormElement

    let formIsValid = true
    for (let inputIdentifier in updatedOrderForm) {
      formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
    }

    this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid })
  }

  checkValidity(value, rules) {
    let isValid = true
    if (rules && rules.required) {
      isValid = value.trim() !== '' && isValid
    }
    if (rules && rules.minLength) {
      isValid = value.length >= rules.minLength && isValid
    }
    if (rules && rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid
    }
    return isValid
  }

  render() {
    const formElements = []
    for (let key in this.state.orderForm) {
      formElements.push({
        id: key,
        config: this.state.orderForm[key],
      })
    }

    let form = (
      <form onSubmit={this.orderHandler}>
        {formElements.map((formElement) => (
          <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
          />
        ))}

        <Button btnType="Success" disabled={!this.state.formIsValid}>
          ORDER
        </Button>
      </form>
    )
    if (this.props.loading) {
      form = <Spinner />
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios))
