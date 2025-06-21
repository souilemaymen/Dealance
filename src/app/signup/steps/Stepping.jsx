"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Stepper, { Step } from "./component/Stepper";
import { SparklesCore } from "@/components/Sparkles";
import { Pencil } from "lucide-react";

const SparklesWrapper = React.memo(() => {
  return (
    <div className="w-full absolute h-screen">
      <SparklesCore
        background="transparent"
        minSize={0.6}
        maxSize={1.4}
        className="w-full h-full"
        particleColor="#302546"
      />
    </div>
  );
});

const Stepping = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  React.useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();
      
      if (res.ok && data.userId) {
        setUserId(data.userId);
      } else {
        router.push("/login");
      }
    };

    fetchSession();
  }, []);
  const [formData, setFormData] = useState({
    userType: "",
    category: "",
    customCategory: "",
    professionalTitle: "",
    bio: "",
    technologies: "",
    experience: "",
    portfolio: "",
    github: "",
    linkedin: "",
    otherLink: "",
    companyName: "",
    projectDescription: "",
    projectBudget: "",
    profileImage: "",
  });

  const [loading, setLoading] = useState(false);
  
  // Fonction de conversion d'image en base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
  
  // Fonction de soumission du formulaire
  const handleSubmit = async () => {
    if (!userId) {
      alert("User ID is missing.");
      return;
    }

    setLoading(true);

    try {
      const submitData = { 
        ...formData,
        userType: formData.userType,
        category: isFreelancer ? selectedCategory : formData.category,
      };

      if (profileImage) {
        submitData.profileImage = await toBase64(profileImage);
      } else {
        submitData.profileImage = null;
      }

      if (isFreelancer && category === "Other...") {
        submitData.customCategory = customCategory;
      }

      const res = await fetch(`/api/user?userId=${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Submission failed: " + (data.error || "Unknown error"));
      } else {
        alert("✅ Profile submitted successfully!");
        router.push("/Acceuil");
      }
    } catch (error) {
      console.error("❌ Submit error", error);
      alert("Submission failed: Network or server error");
    } finally {
      setLoading(false);
    }
  };
  
  const [userType, setUserType] = useState(null);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const isFreelancer = userType === "freelancer";
  const isClient = userType === "client";

  const selectedCategory = category === "Other..." ? customCategory : category;

  /*React.useEffect(() => {
    if (userType) localStorage.setItem("userType", userType);
  }, [userType]);*/
  
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category: selectedCategory,
      profileImage: profileImage ? URL.createObjectURL(profileImage) : ""
    }));
  }, [selectedCategory, profileImage]);

  return (
    <section>
      <SparklesWrapper />
      <Stepper
        initialStep={1}
        backButtonText="Previous"
        nextButtonText="Next"
        completeButtonText="Complete" // Nouveau texte pour le bouton
        disableStepIndicators={true}
        onStepChange={(step) => console.log("Step changed to", step)}
        stepCircleContainerClassName="relative z-20"
        onFinalStepCompleted={handleSubmit} // Utilisation du nouveau callback
        completeButtonProps={{ // Props pour le bouton "Complete"
          disabled: loading,
          className: `mt-6 py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`
        }}
      >
        {/* Étape 1 - Sélection du type de compte */}
        <Step>
          <div className="flex flex-col items-center gap-6 mt-10">
            <h2 className="font-semibold tracking-wider">Welcome to our Platform</h2>
            <p className="mb-1">Please select your Account type</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => {
                  setUserType("freelancer");
                  setFormData((prev) => ({
                    ...prev,
                    userType: "freelancer",
                  }));
                }}
                className={`w-40 py-4 text-lg font-semibold rounded-2xl transition duration-300 ${
                  userType === "freelancer"
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => {
                  setUserType("client");
                  setFormData((prev) => ({
                    ...prev,
                    userType: "client",
                  }));
                }}
                className={`w-40 py-4 text-lg font-semibold rounded-2xl transition duration-300 ${
                  userType === "client"
                    ? "bg-black text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Client
              </button>
            </div>
          </div>
        </Step>

        {/* Étape 2 - Informations spécifiques au type de compte */}
        {userType && (
          <Step>
            {isFreelancer && (
              <>
                <h2 className="font-semibold tracking-wider">Choose Your Field</h2>
                <p>Select Your Main Service</p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {[
                    "Full Stack DEV",
                    "App Development",
                    "UI/UX Design",
                    "Graphic Design",
                    "Video Editing",
                    "Digital Marketing",
                    "Content Writing",
                    "Data Science",
                    "Machine Learning",
                    "DevOps",
                    "Cybersecurity",
                    "Cloud Computing",
                    "Artificial Intelligence",
                    "Other...",
                  ].map((item) => (
                    <button
                      key={item}
                      onClick={() => {
                        setCategory(item);
                        setFormData((prev) => ({
                          ...prev,
                          category: item,
                          customCategory: "",
                        }));
                        if (item !== "Other...") setCustomCategory("");
                      }}
                      className={`py-2 px-4 rounded-xl ${
                        category === item
                          ? "bg-black text-white-50"
                          : "bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {category === "Other..." && (
                  <div className="mt-4">
                    <label className="block mb-2 font-semibold">
                      Please Specify Your Field:
                    </label>
                    <input
                      type="text"
                      placeholder="Type it here"
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          customCategory: e.target.value,
                        }));
                      }}
                      className="border rounded-lg p-2 w-full outline-none"
                    />
                  </div>
                )}
              </>
            )}
            {isClient && (
              <>
                <h2 className="font-semibold tracking-wider">Business Information</h2>
                <div className="flex flex-col">
                  <span>Company | Business Name</span>
                  <input
                    type="text"
                    placeholder="(optional)"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        companyName: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 mt-2 w-full outline-none"
                  />
                  <span className="mt-4">Project Description</span>
                  <textarea
                    placeholder="Type it Here"
                    value={formData.projectDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        projectDescription: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 mt-2 w-full outline-none"
                  ></textarea>
                </div>
              </>
            )}
          </Step>
        )}

        {/* Étape 3 - Détails spécifiques au type de compte */}
        {userType && (
          <Step>
            {isFreelancer && selectedCategory && (
              <>
                <h2 className="text-center text-xl font-bold tracking-wider">
                  {selectedCategory}
                </h2>
                <div className="flex flex-col">
                  <h2 className="font-semibold tracking text-lg">Profile Setup</h2>
                  <span className="mt-2">Professional Title</span>
                  <input
                    type="text"
                    placeholder="Web Designer, Developer etc"
                    value={formData.professionalTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        professionalTitle: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 w-full mt-2 outline-none"
                  />
                  <span className="mt-4">Short Bio</span>
                  <textarea
                    placeholder="Write Something About You"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bio: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 w-full mt-2 outline-none"
                  />
                </div>
              </>
            )}
            {isClient && (
              <>
                <h2 className="font-semibold tracking-wider">Project Budget</h2>
                <div className="flex flex-col">
                  <span>Budget Range (100 DT - 10000 DT) </span>
                  <input
                    type="text"
                    placeholder="900 DT"
                    value={formData.projectBudget}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        projectBudget: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 w-full mt-2 outline-none"
                  />
                </div>
              </>
            )}
          </Step>
        )}

        {/* Étape 4 - Finalisation */}
        {userType && (
          <Step>
            {isFreelancer && selectedCategory && (
              <>
                <h2 className="font-semibold tracking-wider">Technology & Experience</h2>
                <div className="flex flex-col">
                  <span className="mt-2">Your Technologies</span>
                  <input
                    type="text"
                    placeholder="Skills (React, Node, TailwindCSS)"
                    value={formData.technologies}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        technologies: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 w-full mt-2 outline-none"
                  />
                  <span className="mt-3">Your Experience</span>
                  <input
                    type="text"
                    placeholder="Tell us about your relevant experience."
                    value={formData.experience}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 w-full mt-2 outline-none"
                  />
                </div>
              </>
            )}
            
            {/* SUPPRESSION DU BOUTON DE SOUMISSION POUR LES CLIENTS */}
            {isClient && (
              <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl w-full max-w-md mx-auto">
                <h2 className="font-semibold tracking-wider text-lg">Final Confirmation</h2>
                <p className="text-sm text-gray-500 text-center">Upload your logo or business image</p>

                <div className="relative group">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 shadow-lg transition-transform duration-300 group-hover:brightness-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed text-sm text-gray-500 font-semibold">
                      No Image
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-200 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="hidden"
                    />
                    <Pencil size={16} className="text-black" />
                  </label>
                </div>
              </div>
            )}
          </Step>
        )}

        {/* Étapes supplémentaires UNIQUEMENT pour les freelances */}
        {/* Étape 5 - Portfolio (uniquement pour freelances) */}
        {isFreelancer && category && (
          <Step>
            <h2 className="font-semibold tracking-wider">Portfolio & Links</h2>
            <div className="flex flex-col">
              <span className="mt-2">Portfolio Link</span>
              <input
                type="text"
                placeholder="https://..."
                value={formData.portfolio}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    portfolio: e.target.value,
                  }))
                }
                className="border rounded-lg w-full p-2 mt-2 outline-none"
              />
              <div className="pt-4">
                <span className="mt-2">Other Links</span>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Github Link"
                    value={formData.github}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        github: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 mt-2 w-full outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Linkedin Link"
                    value={formData.linkedin}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        linkedin: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 mt-2 w-full outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Other Link"
                    value={formData.otherLink}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        otherLink: e.target.value,
                      }))
                    }
                    className="border rounded-lg p-2 mt-2 w-full outline-none"
                  />
                </div>
              </div>
            </div>
          </Step>
        )}

        {/* Étape 6 - Upload photo (uniquement pour freelances) */}
        {isFreelancer && userType && (
          <Step>
            {selectedCategory && (
              <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold">Upload Your Profile Picture</h2>
                <div className="relative group">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 shadow-lg transition-transform duration-300 group-hover:brightness-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed text-sm text-gray-500 font-semibold">
                      No Image
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="hidden"
                    />
                    <Pencil size={16} className="text-black" />
                  </label>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Make sure your photo is clear and recent.
                </p>
                
                {/* SUPPRESSION DU BOUTON DE SOUMISSION POUR LES FREELANCERS */}
              </div>
            )}
          </Step>
        )}
      </Stepper>
    </section>
  );
};

export default Stepping;