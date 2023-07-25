import ViewSupport from '../modal/ViewSupport';

const SupportCard = (props) => {



    return (
        <div class="m-2 py-8 px-8 max-w-sm bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <p class="text-slate-400 hover:text-sky-400 text-left">{props.type}</p>
            <div class="text-center space-y-2 sm:text-left">
                <div class="space-y-0.5">
                    <p class="text-lg text-black font-semibold">
                        {props.ticket}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.name}
                    </p>
                    <p class="text-slate-500 font-medium">
                        {props.status}
                    </p>
                </div>
                <ViewSupport id={props.id} name={props.name} subject={props.subject} type={props.type} ticket={props.ticket} date={props.date} message={props.message} status={props.status} email={props.email} />
            </div>
        </div >
    )
}

export default SupportCard