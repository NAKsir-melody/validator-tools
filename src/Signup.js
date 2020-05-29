import React, { Component, useCallback, useEffect, useState } from 'react'
import Big from 'big.js'

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(1).times(10 ** 12).toFixed()

class Signup extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    let loggedIn = this.props.wallet.isSignedIn();

    console.log(loggedIn)

    fetch( "https://rpc.betanet.nearprotocol.com", {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '123',
        method: 'query',
        params: {request_type: 'view_state', finality: 'final', account_id: 'blazenet', prefix_base64: 'U1RBVEU='}
      }) // <-- Post parameters
    })
    .then((response) => response.json())
    .then((responseText) => {

      //console.log(responseText);
      //console.log(JSON.parse(JSON.stringify(responseText.result.values)));
    })
    .catch((error) => {
      console.error(error);
    });

  }

  render() {

      self = this;

      const handleChange = event => {

        event.preventDefault()

        const { fieldset, message, donation } = event.target.elements;

        fieldset.disabled = true

        // update blockchain data in background
        // add uuid to each message, so we know which one is already known

        const result = contract.addMessage({ text: message.value },
          BOATLOAD_OF_GAS
        )
        .then(() => {

          contract.getMessages().then(messages => {

            self.setState({messages: messages});

            console.log(messages)

            message.value = ''
            fieldset.disabled = false
            message.focus()
          })
        })
      };

      console.log(self.props.wallet.isSignedIn())

      if(!self.props.wallet.isSignedIn()) {
        return <p>&nbsp;</p>
      }

      return (



        <div>
          <form onSubmit={handleChange}>
            <fieldset id="fieldset">
              <p>Howdy {accountId} signup</p>
              <span>To be notified about your validator issues</span>
              <p className="">
                <label htmlFor="message">Email:</label>
                <input
                autoComplete="off"
                autoFocus
                id="message"
                required
                />
              </p>
              <button type="submit">Sign Up</button>
            </fieldset>
          </form>


              {!!self.props.messages && (
            <>
            <h2>Messages</h2>
            {self.props.messages.map((message, i) =>
              // TODO: format as cards, add timestamp
              <p key={i} className={message.premium ? 'is-premium' : ''}>
                <strong>{message.sender}</strong>: <br/>
                {message.text}
              </p>
              )}
            </>
          )}
        </div>
      );
    
  }
}

export default Signup;