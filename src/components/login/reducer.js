import {
  UPDATE_LOGIN_FIELD,
  CHECK_LOGIN_FIELDS,
  TOGGLE_PASSWORD_VISIBILITY,
  REQUEST_LOGIN_INIT,
  REQUEST_LOGIN_START,
  REQUEST_LOGIN_DONE,
  REQUEST_LOGIN_FAIL,
} from './actionTypes'
import {regexps} from '../../utils/'

const thisState = {
  fields: {
    email: {
      value: '',
      error: false,
    },
    password: {
      value: '',
      error: false,
      visible: false,
    },
  },
  fieldsValid: true,
  loginRequestStatus: 'initial',
  loginRequestResultMessage: '',
  loginRequestResult: null,
}

const {emailReg, passwordReg} = regexps

export default (state = thisState, action) => {
  switch (action.type) {

    // 更新登录字段
    case UPDATE_LOGIN_FIELD:
      const {fieldName, fieldValue} = action
      const newfields = state.fields
      newfields[fieldName].value = fieldValue
      return {
        ...state,
        fields: newfields
      }

    // 切换密码的可见状态
    case TOGGLE_PASSWORD_VISIBILITY:
      const fieldsToSwitch = state.fields
      fieldsToSwitch.password.visible =
        !fieldsToSwitch.password.visible
      return {
        ...state,
        fields: fieldsToSwitch
      }

    // 检查登录字段是否全部有效
    case CHECK_LOGIN_FIELDS:
      const fieldsToCheck = state.fields
      const emailError = !emailReg.test(fieldsToCheck.email.value)
      fieldsToCheck.email.error = emailError
      const passwordError = !passwordReg.test(fieldsToCheck.password.value)
      fieldsToCheck.password.error = passwordError
      const fieldsValid = !emailError && !passwordError
      return {
        ...state,
        fields: fieldsToCheck,
        fieldsValid,
        loginRequestStatus: fieldsValid ? 'loading' : 'initial',
      }

    // 初始化登录状态
    case REQUEST_LOGIN_INIT:
      return {
        ...state,
        loginRequestStatus: 'initial',
        loginRequestResult: null,
      }

    // 开始登录
    case REQUEST_LOGIN_START:
      return {
        ...state,
        loginRequestStatus: 'loading',
        loginRequestResult: null,
      }

    // 登录成功
    case REQUEST_LOGIN_DONE:
      return {
        ...state,
        loginRequestStatus: 'success',
        loginRequestResult: action.r.data,
        loginRequestResultMessage: action.r.data.msg,
      }

    // 登录失败
    case REQUEST_LOGIN_FAIL:
      return {
        ...state,
        loginRequestStatus: 'failure',
        loginRequestResult: null,
        loginRequestResultMessage: action.e,
      }

    default:
      return state
  }
}