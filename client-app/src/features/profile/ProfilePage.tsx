
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent"
import { useProfile } from "../../lib/hooks/useProfile";
import { Typography } from "@mui/material";
import { useParams } from "react-router";

export default function ProfilePage() {
    const { id } = useParams();
    const { profile, loadingProfile } = useProfile(id);

    if (loadingProfile) return <Typography>Loading profile...</Typography>

    if (!profile) return <Typography>Profile not found</Typography>

    return (
       <div>
            <ProfileHeader profile={ profile} />
        <ProfileContent/>
        </div>
    )
}