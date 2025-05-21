export type FormTitleProps = {
    title: string;
    desc?: string;
}
export default function FormTitle({ title, desc } : FormTitleProps ) {
    return (
        <div className="px-2 pr-14">
                <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                    {title}
                </h4>
                {desc && (
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                        {desc}
                    </p>
                )}
        </div>
    )
}   