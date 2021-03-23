import { countries } from 'countries-list'
import { useEffect, useRef, useState } from 'react'

import styles from '@/styles/components/CountriesSelect.module.sass'

const CountriesSelect = ({ onChange, defaultCountrySelected, ...props }) => {
  const [countrySelected, setCountry] = useState('')
  const [isShow, show] = useState(false)

  const wrapperRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        show(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const orderedCountries = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name))

  useEffect(() => {
    setCountry(orderedCountries.find(c => c.name === defaultCountrySelected).name)
  }, [])

  const selectCountry = (country) => {
    setCountry(country.name)
    show(false)
    onChange(country.name)
  }

  return (
    <div
      className={styles.select}
      {...props}
    >
      <div
        onClick={() => show(!isShow)}
        className={styles.fakeInput}
      >
        {
          countrySelected
            ? <p>{ countrySelected }</p>
            : <span>Country*</span>
        }
      </div>
      {
        isShow &&
        <ul
          className={styles.countries}
          ref={wrapperRef}
        >
          {
            orderedCountries.map((country) => {
              return (
                <div
                  key={country.name}
                  className={styles.country}
                  onClick={() => selectCountry(country)}
                >
                  <span>{country.emoji}</span>
                  <p>{country.name}</p>
                </div>
              )
            })
          }
        </ul>
      }
    </div>
  )
}


export default CountriesSelect