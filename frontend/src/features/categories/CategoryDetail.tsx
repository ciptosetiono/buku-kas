import { Category } from "./CategoryInterface";
import { DetailCard, DetailRow } from "@/components/data-detail";
import Alert from "@/components/ui/alert/Alert";

export default function CategoryDetail({ category} : {category: Category | undefined}) {
    
    if (!category) {
        return <Alert variant="error" title="Error" message="No Account Provided"/>
    }

    return (
        <DetailCard title="Detail Account">
            <DetailRow label="Name" value={category.name}/>
            <DetailRow label="Type" value={category.type}/>
        </DetailCard>
    );
}
