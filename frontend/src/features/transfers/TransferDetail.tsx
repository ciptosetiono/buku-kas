import { Transfer } from "./TransferInterface";
import { DetailCard, DetailRow } from "@/components/data-detail";
import { formatRupiah, formatTanggal } from "@/utils/format";

export default function TransferDetail({ transfer} : {transfer: Transfer}) {
    
    return (
        <DetailCard title="Detail Transaction">
            <DetailRow label="From" value={transfer.fromAccount.name}/>
            <DetailRow label="To" value={transfer.toAccount.name}/>
            <DetailRow label="Date" value={formatTanggal(transfer.date)}/>
            <DetailRow label="Note" value={transfer.note || ""}/>
            <DetailRow label="Amount" value={formatRupiah(transfer.amount)}/>
        </DetailCard>
    );
}
