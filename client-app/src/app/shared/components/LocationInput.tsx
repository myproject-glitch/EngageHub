﻿import { TextFieldProps, TextField, Box, Typography, List, ListItemButton, debounce } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { FieldValues, UseControllerProps, useController } from "react-hook-form";
import { LocationIQSuggestion } from "../../../lib/types";
import axios from "axios";


type Props<T extends FieldValues> = {
label:string
} & UseControllerProps<T> & TextFieldProps


export default function LocationInput<T extends FieldValues>(props: Props<T>) {
    const { field, fieldState } = useController({ ...props });
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<LocationIQSuggestion[]>([]);
    const [inputValue, setInputValue] = useState(field.value || '');

    useEffect(() => {
        if (field.value && typeof field.value === 'object') {
            setInputValue(field.value.venue || '')
        } else {
            setInputValue(field.value || '');
        }
    }, [field.value ])

    const locationUrl = 'https://api.locationiq.com/v1/autocomplete?key=pk.0ce41531b41d4b0894244231c1b1f506&limit=5&dedupe=1&'

    const fetchSuggestions = useMemo(
        () => debounce(async (query: string) => {
            if (!query || query.length < 3) {
                setSuggestions([]);
                return;
            }
            setLoading(true);

            try {
                const res = await axios.get<LocationIQSuggestion[]>(`${locationUrl}q=${query}`);
                setSuggestions(res.data)
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }, 1000), [locationUrl]
    );

    const handleChange = async (value: string) => {
        field.onChange(value);
        await fetchSuggestions(value)
    }

    const handleSelect = (location: LocationIQSuggestion) => {
        const city = location.address?.city || location.address?.town || location.address?.village
        const venue = location.display_name
        const latitude = location.lat
        const longitude = location.lon


        setInputValue(venue);
        field.onChange({ city, venue, latitude, longitude });
        setSuggestions([]);
    }

    return (
        <Box>
            <TextField
                {...props}
                value={inputValue}
                onChange={e => handleChange(e.target.value)}
                fullWidth
                variant="outlined"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
            />
            {loading && <Typography>Loading...</Typography>}
            {suggestions.length > 0 && (

                <List sx={{ border: 1 }}>
                    {suggestions.map(suggestion => (
                        <ListItemButton
                            divider
                            key={suggestion.place_id}
                            onClick={() => handleSelect(suggestion)}
                        >
                            {suggestion.display_name}

                        </ListItemButton>
                        
                    ))}
                </List>
            )}
        </Box>
    )
}