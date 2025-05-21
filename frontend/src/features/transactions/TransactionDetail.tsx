import { Transaction } from "./TransactionInterface";
import { DetailCard, DetailRow } from "@/components/data-detail";
import { formatRupiah, formatTanggal } from "@/utils/format";

export default function TransactionDetail({ transaction} : {transaction: Transaction}) {
    

    return (
        <DetailCard title="Detail Transaction">
            <DetailRow label="Type" value={transaction.type.toString()}/>
            <DetailRow label="Account" value={transaction.account.name}/>
            <DetailRow label="Category" value={transaction.category.name}/>
            <DetailRow label="Note" value={transaction.note || ""}/>
            <DetailRow label="Date" value={formatTanggal(transaction.date)}/>
            <DetailRow label="Amount" value={formatRupiah(transaction.amount)}/>
        </DetailCard>
    );
}
