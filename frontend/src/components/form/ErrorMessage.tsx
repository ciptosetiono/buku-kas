import { ErrorMessage as Error} from "formik";


export default function ErrorMessage({name} : {name: string}) {

    return(
        <Error
            name={name}
            component="div"
            className="text-sm text-red-500 mt-1"
        />
    )
}