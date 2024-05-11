'use client'
import React, { useEffect, useState } from 'react';
import data from '../../../country-state-city.json';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

interface City {
  id: number;
  name: string;
}

interface State {
  id: number;
  name: string;
  cities: City[];
}

interface Country {
  id: number;
  name: string;
  states: State[];
}


const countryData: Country[] = (data as Country[]).map((country: Country) => ({
  id: country.id,
  name: country.name,
  states: country.states.map((state: State) => ({
    id: state.id,
    name: state.name,
    cities: state.cities.map((city: City) => ({
      id: city.id,
      name: city.name
    }))
  }))
}));

export default function LocationSelector() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);

  useEffect(() => {
    setCountries(countryData);
  }, []);

  const handleCountryChange = (value: string) => {
    const countryId = Number(value);
    const country = countries.find((country: Country) => country.id === countryId);
    if (country) {
      setStates(country.states);
      setSelectedCountry(country.id);
    } else {
      setStates([]);
      setSelectedCountry(null);
    }
    setCities([]);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (value: string) => {
    const stateId = Number(value);
    const state = states.find((state: State) => state.id === stateId);
    if (state) {
      setCities(state.cities);
      setSelectedState(state.id);
    } else {
      setCities([]);
      setSelectedState(null);
    }
    setSelectedCity(null);
  };

  const handleCityChange = (value: string) => {
    const cityId = Number(value);
    const city = cities.find((city: City) => city.id === cityId);
    if (city) {
      setSelectedCity(city.id);
    } else {
      setSelectedCity(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  ">
      {/* <div className="p-8 bg-white rounded shadow-md mb-8"> */}
      <Card className="w-[350px] p-8 mb-8"> 
        <h2 className="text-xl font-semibold mb-4">Select a Location</h2>
        <div className="flex flex-col space-y-4">
          {/* Country Select */}
          <Select onValueChange={handleCountryChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country: Country) => (
                  <SelectItem key={country.id} value={String(country.id)}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* State Select */}
          <Select onValueChange={handleStateChange} disabled={!selectedCountry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={selectedCountry ? "Select State" : "Select Country First"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {states.map((state: State) => (
                  <SelectItem key={state.id} value={String(state.id)}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* City Select */}
          <Select onValueChange={handleCityChange} disabled={!selectedState}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={selectedState ? "Select City" : "Select State First"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {cities.map((city: City) => (
                  <SelectItem key={city.id} value={String(city.id)}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      {/* </div> */}
      </Card>

      {(selectedCountry || selectedState || selectedCity) && (
        <Card className="w-[350px] p-8 mb-8"> 
          <CardHeader className=" text-white p-4 rounded-t">
            <CardTitle>Selected Location</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              {selectedCountry && (
                <CardDescription>
                  <span className="font-semibold">Country:</span> {countries.find(c => c.id === selectedCountry)?.name}
                </CardDescription>
              )}
              {selectedState && (
                <CardDescription>
                  <span className="font-semibold">State:</span> {states.find(s => s.id === selectedState)?.name}
                </CardDescription>
              )}
              {selectedCity && (
                <CardDescription>
                  <span className="font-semibold">City:</span> {cities.find(c => c.id === selectedCity)?.name}
                </CardDescription>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4 rounded-b">
          </CardFooter>
        </Card>
      )}
    </div>
  );
}