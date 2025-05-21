import Account  from "./accountInterface";
import { DetailCard, DetailRow } from "@/components/data-detail";
import Alert from "@/components/ui/alert/Alert";

export default function AccountDetail({ account} : {account: Account | undefined}) {
    if (!account) {
        return <Alert variant="error" title="Error" message="No Account Provided"/>
    }

    return (
        <DetailCard title="Detail Account">
            <DetailRow label="Name" value={account.name}/>
            <DetailRow label="Balance" value={account.balance.toString()}/>
        </DetailCard>
    );
}
