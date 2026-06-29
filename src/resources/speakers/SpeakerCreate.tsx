import { Create, ImageField, ImageInput, SimpleForm, TextInput, required } from "react-admin";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function transformSpeakerPayload(data: any) {
  let photo = data.photo;

  if (data.photo?.rawFile) {
    photo = await fileToBase64(data.photo.rawFile);
  } else if (data.photo?.src) {
    photo = data.photo.src;
  }

  return {
    ...data,
    photo,
  };
}

export function SpeakerCreate() {
  return (
    <Create title="Create speaker" redirect="list" className="speaker-form-page" transform={transformSpeakerPayload}>
      <SimpleForm>
        <TextInput source="name" label="Name" validate={required()} fullWidth />
        <TextInput source="role" label="Role" validate={required()} fullWidth />
        <TextInput source="specialty" label="Specialty" validate={required()} fullWidth />
        <TextInput source="company" label="Company" validate={required()} fullWidth />

        <TextInput source="bio" label="Bio" multiline rows={5} fullWidth />

        <ImageInput
          source="photo"
          label="Speaker photo"
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
        >
          <ImageField source="src" title="title" />
        </ImageInput>
        
        <TextInput source="initials" label="Initials" validate={required()} fullWidth />

        <TextInput source="linkedin" label="LinkedIn" fullWidth />
        <TextInput source="twitter" label="Twitter" fullWidth />
        <TextInput source="website" label="Website" fullWidth />

        <TextInput source="day" label="Day" fullWidth />
        <TextInput source="sessionType" label="Session type" fullWidth />
      </SimpleForm>
    </Create>
  );
}
