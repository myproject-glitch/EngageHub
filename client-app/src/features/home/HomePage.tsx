import { Group } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router";  

export default function HomePage() {
    return (
        <Paper
            sx={{
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundImage: 'linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)'  // ✅ Fixed Gradient
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    color: 'white'
                }}
            >
                <Group sx={{ height: 110, width: 110 }} />
                <Typography variant="h1">
                    EngageHub
                </Typography>
            </Box>

            <Typography variant="h2">
                Welcome to EngageHub
            </Typography>

            <Button
                component={Link}  // ✅ Ensure "react-router-dom" is installed
                to="/activities"
                size="large"
                variant="contained"
                sx={{ height: 80, borderRadius: 4, fontSize: '1.5rem' }}
            >
                Take me to EngageHub!
            </Button>
        </Paper>
    );
}
