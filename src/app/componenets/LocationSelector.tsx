"use client";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
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
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      setValue(country.name);
      setOpen(false);
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

  const handleSelectCountry = () => {
    setOpen(!open);
    if (!open && searchInputRef.current) {
      searchInputRef.current.focus();
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
          <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search country..."
                value={searchTerm}
                onChange={(event) => handleSearchChange(event)}
                className="block w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-inherit"
                ref={searchInputRef}
              />
            
            </div>
            <CommandList>
              {filteredCountries.map((country) => (
                <CommandItem
                  key={country.id}
                  value={String(country.id)}
                  onSelect={() => handleCountryChange(country.id)}
                >
                  {country.name}
                  {selectedCountry === country.id && (
                    <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                  )}
                </CommandItem>
              ))}
            </CommandList>
          </CommandDialog>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            onClick={handleSelectCountry}
          >
            {value || "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

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

