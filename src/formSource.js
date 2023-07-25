//temporary data
export const userInputs = [
    {
        id: "FullName",
        label: "Full Name",
        type:"text",
        placeholder:"enter full name",
    },
    {
        id: "Email",
        label: "Email Address",
        type:"mail",
        placeholder:"enter email address",
    },
    {
        id: "Phone",
        label: "Phone Number",
        type:"text",
        placeholder:"start with country code eg. +234",
    },
    {
        id: "Password",
        label: "Password",
        type:"password",
        placeholder:"Minimum of 8 characters",
    },
    {
        id: "Address",
        label: "Home Address",
        type:"text",
        placeholder:"enter your home address",
    },
    {
        id: "Gender",
        label: "Gender",
        type:"text",
        placeholder:"enter your gender",
    },
    {
        id: "Date of Birth",
        label: "Date of Birth",
        type:"text",
        placeholder:"eg. 23/08/1997",
    },
];

export const driverInputs = [
  {
    id: "FullName",
    label: "Name and surname",
    type: "text",
    placeholder: "John Doe",
  },
  {
    id: "Email",
    label: "Email",
    type: "mail",
    placeholder: "john_doe@gmail.com",
  },
  {
    id: "Date of Birth",
    label: "Date of birth",
    type: "date",
    placeholder: "01/10/1960",
  },

  {
    id: "Phone",
    label: "Phone",
    type: "text",
    placeholder: "+1 234 567 89",
  },
  {
    id: "Password",
    label: "Password",
    type: "password",
  },

  {
    id: "Gender",
    label: "Gender",
    type: "text",
    placeholder: "Male",
  },

  {
    id: "Address",
    label: "Address",
    type: "text",
    placeholder: "Elton St. 216 NewYork",
  },
  {
    id: "State",
    label: "State",
    type: "text",
    placeholder: "Abuja",
  },

  {
    id: "Vehicle Color",
    label: "Vehicle color",
    type: "text",
    placeholder: "Grey",
  },
  {
    id: "Vehicle Make",
    label: "Vehicle make",
    type: "text",
    placeholder: "GMC",
  },

  {
    id: "Vehicle Model",
    label: "Vehicle Model",
    type: "text",
    placeholder: "Borrego",
  },

  {
    id: "Vehicle Number",
    label: "Vehicle Number",
    type: "text",
    placeholder: "ggg222gh",
  },

  {
    id: "Vehicle Year",
    label: "Vehicle year",
    type: "text",
    placeholder: "2021",
  },

  {
    id: "Verified",
    label: "Verification Status",
    type: "select",
    options: [
      { value: "", label: "Status" },
      { value: "1", label: "Verified" },
      { value: "0", label: "Not Verified" },
    ],
  },

  {
    id: "Online",
    label: "Active Status",
    type: "select",
    options: [
      { value: "", label: "Status" },
      { value: "0", label: "Offline" },
    ],
  },

  {
    id: "Documents",
    label: "Driver's Permit",
    type: "file",
    multiple: true,
    placeholder: "upload documents",
  },

  {
    id: "Company",
    label: "Company's Name",
    type: "text",
    placeholder: "Transcorp",
  },

];

export const companyInputs = [
  {
    id: "company",
    label: "Company's Name",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
  },

  {
    id: "date",
    label: "Date Registered",
    type: "date",
  },

  {
    id: "phone",
    label: "Phone",
    type: "number",
  },

  {
    id: "password",
    label: "Password",
    type: "password",
  },

  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Elton St. 216 NewYork",
  },
  {
    id: "location",
    label: "State",
    type: "text",
  },


  {
    id: "regnumber",
    label: "Registered Number",
    type: "text",
  },

  {
    id: "documents",
    label: "Documents",
    type: "file",
    multiple: true,
    placeholder: "upload documents",
  },

];

export const adminInputs = [
  {
    id: "name",
    label: "Admin Name",
    type: "text",
  },
  {
    id: "email",
    label: "Email",
    type: "email",
  },

  {
    id: "dateCreated",
    label: "Date Registered",
    type: "date",
  },
];