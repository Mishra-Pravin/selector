'use client'
import React, { useEffect, useState } from "react";
import data from "../../../country-state-city.json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
      name: city.name,
    })),
  })),
}));

export default function LocationSelector() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setCountries(countryData);
    setFilteredCountries(countryData);
  }, []);

  const handleCountryChange = (countryId: number) => {
    const country = countries.find(
      (country: Country) => country.id === countryId
    );
    if (country) {
      setStates(country.states);
      setSelectedCountry(country.id);
      setFilteredCountries([country]);
    } else {
      setStates([]);
      setSelectedCountry(null);
    }
    setCities([]);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (stateId: number) => {
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

  const handleCityChange = (cityId: number) => {
    setSelectedCity(cityId);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    if (!searchValue) {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[350px] p-8 mb-8">
        <CardTitle className="text-xl font-semibold mb-4">
          Select a Location
        </CardTitle>
        <div className="flex flex-col space-y-4">
          {/* Searchable Country Select */}
          <div className="relative ">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="block w-full text-sm border-gray-200 rounded-lg focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1] dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 py-2 px-3"
            />
            {searchTerm && (
              <ul className="mt-2 max-h-72 pb-1 px-1 space-y-0.5 z-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 dark:bg-neutral-900 dark:border-neutral-700">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <li
                      key={country.id}
                      className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-200 dark:focus:bg-neutral-800"
                      onClick={() => handleCountryChange(country.id)}
                    >
                      {country.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">
                    No countries found.
                  </li>
                )}
              </ul>
            )}
          </div>
          {/* State Select */}
          <Select
            onValueChange={(value) => handleStateChange(Number(value))}
            disabled={!selectedCountry}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  selectedCountry ? "Select State" : "Select Country First"
                }
              />
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
          <Select
            onValueChange={(value) => handleCityChange(Number(value))}
            disabled={!selectedState}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  selectedState ? "Select City" : "Select State First"
                }
              />
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
      </Card>

      {(selectedCountry || selectedState || selectedCity) && (
        <Card className="w-[350px] p-8 mb-8">
          <CardHeader className="text-white p-4 rounded-t">
            <CardTitle>Selected Location</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col space-y-2">
              {selectedCountry && (
                <CardDescription>
                  <span className="font-semibold">Country:</span>{" "}
                  {countries.find((c) => c.id === selectedCountry)?.name}
                </CardDescription>
              )}
              {selectedState && (
                <CardDescription>
                  <span className="font-semibold">State:</span>{" "}
                  {states.find((s) => s.id === selectedState)?.name}
                </CardDescription>
              )}
              {selectedCity && (
                <CardDescription>
                  <span className="font-semibold">City:</span>{" "}
                  {cities.find((c) => c.id === selectedCity)?.name}
                </CardDescription>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-4 rounded-b"></CardFooter>
        </Card>
      )}
    </div>
  );
}