import NewProjectSection from "./NewProjectSection";
import AllProjectsSection from "./AllProjectsSection";

export const MyProjectsPage = () => {
  return (
    <div className="bg-black2 text-white p-8 min-h-screen ">
      <div className="container">
        <h1 className="text-3xl font-bold mb-8">My Projects</h1>
        <NewProjectSection />
        <AllProjectsSection />
      </div>
    </div>
  );
};
