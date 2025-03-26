import { AlertTriangle, Phone } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "Respectful Communication",
    content: `We ask everyone to engage with kindness and empathy. It’s essential to maintain a respectful environment where our volunteers, who are here to listen and support, are treated with the same courtesy. Inappropriate, offensive, or harmful language towards our volunteers or others will not be tolerated.`,
  },
  {
    title: "Confidentiality and Privacy",
    content: `While conversing, please refrain from sharing any personally identifiable information (PII), such as your real name, address, phone number, email, or other personal details. Anonymous Voices is committed to respecting and protecting user privacy, ensuring a safe and secure environment.`,
  },
  {
    title: "No Offensive or Harmful Behavior",
    content: `Hate speech, harassment, threats, discriminatory remarks, or any form of abuse are strictly prohibited. Avoid engaging in conversations that can cause harm or discomfort to others, including promoting violence, self-harm, or any illegal activity. Users engaging in such actions will be reported to our team and may lose access to the platform`,
  },
  {
    title: "No sexual harassment or fantasies",
    content: `No sexual harassment or inappropriate content is permitted. This includes but is not limited to, sending suggestive texts, notes, or emojis, making sexual jokes, repeatedly asking for dates, using vulgar language during phone calls, making inappropriate noises, and using harmful slang. Any content that includes sexual fantasies, explicit descriptions, or negative comments related to sexual orientation or personal characteristics is strictly forbidden.`,
  },
  {
    title: "No Spam or Promotional Content",
    content: `This platform is designed for emotional expression and support, not for advertising products, services, or individuals. Promotional content and spam are strictly prohibited.`,
  },
  {
    title: "Report Misconduct",
    content: `If any misconduct is experienced or witnessed by a volunteer, or if inappropriate behaviour is encountered, it should be reported through the platform's reporting tools. All concerns will be treated with the utmost seriousness and addressed promptly.`,
  },
];
const volunteer = [
  {
    title: "Maintain Confidentiality",
    content: `All user conversations must be treated with confidentiality, and no details are to be shared outside the platform. This approach helps create a safe space for emotional expression. Volunteers are advised not to request personal information from users, such as real names, addresses, or contact details.`,
  },
  {
    title: "Non-Judgmental Approach",
    content: `Listen without judgment. Volunteers must provide a safe space where users can express themselves without fear of criticism or disapproval. Respect the beliefs, emotions, and situations of all users, regardless of personal opinions.`,
  },
  {
    title: "No Professional Advice",
    content: `Volunteers should not offer any form of medical, legal, or professional advice. Anonymous Voices is a platform for support and expression, not therapy or professional guidance. Always direct users to appropriate resources or professionals if they are in need of professional support.`,
  },
  {
    title: "Maintain and Respect Boundaries",
    content: `Volunteers should maintain appropriate and respectful boundaries in all interactions, avoiding overly personal or inappropriate conversations. If a user feels uncomfortable discussing certain topics, volunteers must acknowledge this and allow the user to guide the conversation. If a volunteer feels uncomfortable, they should seek guidance from a supervisor or consult with the team to ensure the conversation is handled appropriately.`,
  },
  {
    title: "No External Contact",
    content: `Volunteers are expected to maintain professional boundaries and avoid contacting users outside the platform. This platform is built to ensure anonymity and protection, and any violation such as forming personal relationships or reaching out beyond the platform will be considered misconduct.`,
  },
  {
    title: "Diversity and Inclusion",
    content: `Volunteers must strive to understand and respect the diversity of users, including differences in age, ethnicity, culture, gender, disability, religion, sexual orientation, and socioeconomic status.`,
  },
  {
    title: "No Self-Promotion",
    content: `Volunteers should not use the platform to promote personal agendas, businesses, or services. Avoid engaging in activities that could be perceived as solicitation or promoting external resources that are not vetted by Anonymous Voices.`,
  },
  {
    title: "Professionalism and Care",
    content: `Users should always be treated with compassion, patience, and professionalism. As they seek support and guidance, sensitivity to their needs and emotions is essential to provide the care they require.`,
  },
  {
    title: "Professionalism and Care",
    content: `Users should always be treated with compassion, patience, and professionalism. As they seek support and guidance, sensitivity to their needs and emotions is essential to provide the care they require.`,
  },
];

export default function TermsSection() {
  return (
    <section className="w-full min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-4xl font-semibold text-center text-[#9B8ACB] mb-12">
        Code of Ethics
        </h1>
        <p className="text-sm text-center">At Anonymous Voices, we are committed to maintaining a safe, inclusive, and respectful environment for all users and volunteers. To promote a community characterized by trust and compassion, we request that all participants adhere to the following guidelines.</p>
        <h1 className="text-2xl md:text-2xl font-semibold text-[#9B8ACB] pt-8 ms-6">
        FOR USERS
        </h1>

        {sections.map((section, index) => (
          <Card
            key={index}
            className="bg-transparent border-none shadow-none"
          >
            <CardHeader>
              <CardTitle className="text-xl text-[#86C6C6]">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-sm">
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </CardContent>
          </Card>
        ))}
        <h1 className="text-2xl md:text-2xl font-semibold text-[#9B8ACB] pt-8 ms-6">
        For Volunteers
        </h1>
        {volunteer.map((section, index) => (
          <Card
            key={index}
            className="bg-transparent border-none shadow-none"
          >
            <CardHeader>
              <CardTitle className="text-xl text-[#86C6C6]">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-sm">
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            </CardContent>
          </Card>
        ))}

        <Alert variant="destructive" className="max-w-3xl mx-auto">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-extrabold">Important Notice</AlertTitle>
          <AlertDescription className="text-sm font-bold">
          By using or volunteering for Anonymous Voices, you agree to uphold this Code of Conduct. Help us build a space where every voice is valued, and emotional expression is free from judgment, ensuring everyone feels heard and understood.
          </AlertDescription>
        </Alert>

        <Card className="bg-violet text-white max-w-3xl mx-auto mt-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 justify-center">
              <Phone size={20} />
              <a href="tel:999" className="font-medium">
                Emergency? Call 999
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
