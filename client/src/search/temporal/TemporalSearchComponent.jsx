import React from 'react'
import { DateRange } from './TemporalActions'
import DayPicker, { DateUtils } from 'react-day-picker'
import styles from './temporal.css'
import ToggleDisplay from 'react-toggle-display'
import moment from 'moment'
import YearMonthForm from './YearMonthForm'

const currentYear = (new Date()).getFullYear()
const fromMonth = new Date(currentYear - 100, 0, 1, 0, 0)
const toMonth = new Date()

//const TemporalSearch = ({onChange, currentDate}) => {
class TemporalSearch extends React.Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.showCurrentDate = this.showCurrentDate.bind(this)
    this.render = this.render.bind(this)
    this.state = this.initialState()
    this.emitDate
  }

  initialState() {
    return {
      from: null,
      to: null,
      initialMonth: toMonth,
      showCalendar: false
    }
  }

  handleDayClick(e, day) {
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
  }

  handleInputChange(e) {
    const { value } = e.target
    if (moment(value, 'L', true).isValid()) {
      this.setState({
        month: moment(value, 'L').toDate(),
        value,
      }, this.showCurrentDate)
    } else {
      this.setState({ value }, this.showCurrentDate)
    }
  }

  showCurrentDate() {
    // this.refs.daypicker.showMonth(this.state.month)
    this.setState({showCalendar: !this.state.showCalendar})
  }

  handleResetClick(e) {
    e.preventDefault()
    this.setState({
      from: null,
      to: null
    })
  }

  emitDate(dateString, dateSelected ) {
    this.props.updateOnChange(dateString, dateSelected)
  }

  render() {
    const { from, to } = this.state
    return (
      <div className={styles.temporalContainer}>
        <div>
          <div className={styles.dateInputLeft}>
            <input
              ref="input"
              type="text"
              value={ this.state.from }
              placeholder="YYYY-MM-DD"
              onChange={ this.handleInputChange }
              onChange={this.emitDate(from, DateRange.START_DATE)}
              onFocus={ this.showCurrentDate }
            />
          </div>
          <div className={styles.dateInputRight} >
            <input
              ref="input"
              type="text"
              value={ this.state.to }
              placeholder="YYYY-MM-DD"
              onChange={ this.handleInputChange }
              OnChange={this.emitDate(to, DateRange.END_DATE)}
              onFocus={ this.showCurrentDate }
            />
          </div>
        </div>
        <ToggleDisplay show={this.state.showCalendar}>
          <DayPicker className={styles.dateComponent}
            ref="daypicker"
            onDayClick={ this.handleDayClick }
            initialMonth={ this.state.initialMonth }
            fromMonth={ fromMonth }
            toMonth={ toMonth }
            selectedDays={ day => DateUtils.isDayInRange(day, { from, to }) }
            captionElement={
              <YearMonthForm onChange={ initialMonth => this.setState({ initialMonth }) } />
            }
          />
          <div className={styles.resetSelection}>
            <a href="#" onClick={ this.handleResetClick }><strong>Reset</strong></a>
          </div>
        </ToggleDisplay>
      </div>
    )
  }
}

export default TemporalSearch
