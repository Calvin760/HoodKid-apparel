import { UserProfile } from "@clerk/clerk-react";

const Profile = () => {
    return (
        <div className="flex justify-center py-10">
            <UserProfile />
        </div>
    );
};

export default Profile;