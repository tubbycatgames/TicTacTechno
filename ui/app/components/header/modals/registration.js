import _ from 'lodash';
import React from 'react';
import { Button, Input, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { createUser } from 'actions/user';
import { clearRegistrationErrors, toggleRegistration, validateRegistration }
  from 'actions/ui/registration';

class RegistrationModal extends React.Component {
  static propTypes = {
    close: React.PropTypes.func.isRequired,
    clear: React.PropTypes.func.isRequired,
    create: React.PropTypes.func.isRequired,
    errors: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool.isRequired,
    validate: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      clear: props.clear,
      close: props.close,
      create: props.create,
      errors: props.errors,
      show: props.show,
      validate: props.validate
    };
  }

  componentWillReceiveProps = (props) => {
    this.setState({
      errors: props.errors,
      show: props.show
    });
  }

  close = () => {
    this.state.clear();
    this.state.close();
  }

  registerUser = () => {
    const registrationData = {
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue(),
      confirmPassword: this.refs.confirm_password.getValue(),
      email: this.refs.email.getValue(),
      confirmEmail: this.refs.confirm_email.getValue()
    };
    this.state.validate(registrationData);
    _.defer(() => {
      if (_.isEmpty(this.state.errors)) {
        this.state.create(registrationData);
        this.state.close();
      }
    });
  }

  error = (msg) => {
    return <small className='error-message'>{msg}</small>;
  }

  render() {
    return (
      <Modal show={this.state.show}
             onHide={this.close}>
        <Modal.Header closeButton>
          <Modal.Title>Register with TicTacTechno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.error(this.state.errors.username)}
          <Input type='text'
                 ref='username'
                 label='Username'
                 placeholder='Enter Username' />
          {this.error(this.state.errors.password)}
          <Input type='password'
                 ref='password'
                 label='Password'
                 placeholder='Enter Password'/>
          {this.error(this.state.errors.confirmPassword)}
          <Input type='password'
                 ref='confirm_password'
                 label='Confirm Password'
                 placeholder='Confirm Password'/>
          {this.error(this.state.errors.email)}
          <Input type='email'
                 ref='email'
                 label='Email Address'
                 placeholder='Enter Email Address' />
          {this.error(this.state.errors.confirmEmail)}
          <Input type='email'
                 ref='confirm_email'
                 label='Confirm Email'
                 placeholder = 'Confirm Email Address' />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.registerUser}>Register</Button>
          <Button onClick={this.close}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    errors: state.ui.registration.registrationErrors,
    show: state.ui.registration.showRegistration
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clear: () => {
      dispatch(clearRegistrationErrors());
    },
    create: (userData) => {
      dispatch(createUser(userData));
    },
    close: () => {
      dispatch(toggleRegistration());
    },
    validate: (userData) => {
      dispatch(validateRegistration(userData));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationModal);