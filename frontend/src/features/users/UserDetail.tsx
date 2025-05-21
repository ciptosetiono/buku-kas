import { User } from "./UserInterface";
import { DetailCard, DetailRow } from "@/components/data-detail";

export default function UserDetail({ user} : {user: User}) {
    
    return (
        <DetailCard title="Detail User">
            <DetailRow label="Email" value={user.email}/>
            <DetailRow label="Name" value={user?.name}/>
        </DetailCard>
    );
}
