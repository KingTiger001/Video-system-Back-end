import { countries } from "countries-list";
import { useEffect, useRef, useState } from "react";

import styles from "@/styles/components/CountriesSelect.module.sass";

const CountriesSelect = ({ onChange, defaultCountrySelected, ...props }) => {
   const [countrySelected, setCountrySelected] = useState("");
   const [isShow, show] = useState(false);
   const [filterQuery, setFilterQuery] = useState("");
   const [filterTimeout, setFilterTimeout] = useState(null);

   const wrapperRef = useRef(null);
   useEffect(() => {
      const handleClickOutside = (e) => {
         if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            show(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [wrapperRef]);

   const orderedCountries = Object.values(countries).sort((a, b) =>
      a.name.localeCompare(b.name)
   );

   useEffect(() => {
      const country = orderedCountries.find(
         (c) => c.name === defaultCountrySelected
      );
      setCountrySelected(country ? country.name : "");
   }, []);

   const handleKeydown = (e) => {
      if (e.key.length === 1) {
         const query = `${filterQuery}${e.key}`
            .toLowerCase()
            .replace(/ /g, "-");
         setFilterQuery(query);
         clearTimeout(filterTimeout);
         const timeout = setTimeout(findAndScrollDropdown, 400, query);
         setFilterTimeout(timeout);
      }
   };

   const findAndScrollDropdown = (query) => {
      const list = document.getElementById("countries");
      for (let i = 0; i < orderedCountries.length; i += 1) {
         const regex = new RegExp(`^${query}`, "i");
         const match = regex.test(orderedCountries[i].name);
         if (match) {
            list.scrollTop = 41 * i;
            setFilterQuery("");
            return;
         }
      }
      setFilterQuery("");
   };

   const selectCountry = (country) => {
      setCountrySelected(country.name);
      show(false);
      onChange(country.name);
   };

   return (
      <div
         className={styles.select}
         {...props}
         onKeyDown={handleKeydown}
         tabIndex="0"
      >
         <div onClick={() => show(!isShow)} className={styles.fakeInput}>
            {countrySelected ? <p>{countrySelected}</p> : ""}
         </div>
         {isShow && (
            <ul className={styles.countries} id="countries" ref={wrapperRef}>
               {orderedCountries.map((country) => {
                  return (
                     <div
                        key={country.name}
                        id={`country-${country.name
                           .toLowerCase()
                           .replace(/ /g, "-")}`}
                        className={styles.country}
                        onClick={() => selectCountry(country)}
                     >
                        <span>{country.emoji}</span>
                        <p>{country.name}</p>
                     </div>
                  );
               })}
            </ul>
         )}
      </div>
   );
};

export default CountriesSelect;
