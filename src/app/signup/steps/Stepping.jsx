"use client";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Stepper, { Step } from "./component/Stepper";
import { SparklesCore } from "@/components/Sparkles";
import { Pencil } from "lucide-react";
import AnimatedPopup from "@/components/AnimatedPopup";

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
  const [showPopup, setShowPopup] = useState(false);
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
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
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
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push("/Acceuil");
        }, 3000);
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
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      profileImage: profileImage ? URL.createObjectURL(profileImage) : "",
    }));
  }, [selectedCategory, profileImage]);

  return (
    <section>
      <SparklesWrapper />
      <AnimatedPopup
        show={showPopup}
        message="✅ Profile submitted successfully!"
        onClose={() => setShowPopup(false)}
      />
      <Stepper
        initialStep={1}
        backButtonText="Previous"
        nextButtonText="Next"
        disableStepIndicators={true}
        onStepChange={(step) => console.log("Step changed to", step)}
        stepCircleContainerClassName="relative z-20"
        onFinalStepCompleted={handleSubmit}
      >
        {/* Étape 1 - Sélection du type de compte */}
        <Step>
          <div className="flex flex-col items-center gap-6 mt-10">
            <h2 className="font-semibold text-3xl text-black tracking-wider">
              Welcome to our Platform
            </h2>
            <p className="mb-1 tracking-wider text-lg text-white-50">
              Please select your Account type :
            </p>
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
                className={`w-32 text-md tracking-wide font-normal rounded-2xl transition-colors duration-300 ${
                  userType === "freelancer"
                    ? "bg-white-300 text-white-50"
                    : "text-white-100 hover:bg-white-300 hover:text-white-100"
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
                className={`w-32 py-4 text-md font-normal tracking-wide rounded-2xl transition duration-300 ${
                  userType === "client"
                    ? "bg-white-300 text-white-50"
                    : "text-white-100 hover:bg-white-300 hover:text-white-100"
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
                <h2 className="font-semibold text-xl mb-4 tracking-wider">
                  Chose Your Field
                </h2>
                <p className="mt-2 text-white-50 mb-2">
                  Select Your Main Service :
                </p>
                <div className="grid grid-cols-2 gap-4">
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
                <h2 className="font-semibold text-xl tracking-wider mb-4">
                  Business Information
                </h2>
                <div className="flex flex-col space-y-4">
                  <span className="text-white-50">
                    Company - Business Name :
                  </span>
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
                  <span className="text-white-50">Project Description :</span>
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
                <h2 className="text-center text-black text-2xl font-bold tracking-wider">
                  {selectedCategory}
                </h2>
                <div className="flex flex-col space-y-4">
                  <h2 className="font-semibold tracking text-xl">
                    Profile Setup
                  </h2>
                  <span className="mt-2 text-white-50">
                    Professional Title :
                  </span>
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
                  <span className="mt-4 text-white-50">Short Bio :</span>
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
                <h2 className="font-semibold text-xl tracking-wider mb-4">
                  Project Budget
                </h2>
                <div className="flex flex-col space-y-4">
                  <span className="text-white-50">
                    Budget Range (100 DT - 10000 DT) :
                  </span>
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

        {isFreelancer && selectedCategory && (
          <Step>
            <h2 className="font-semibold tracking-wider text-xl mb-4">
              Technologies & Experiences
            </h2>
            <div className="flex flex-col space-y-4">
              <span className="text-white-50">Your Technologies :</span>
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
              <span className="mt-3 text-white-50">Your Experience :</span>
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
          </Step>
        )}

        {/* Étapes supplémentaires UNIQUEMENT pour les freelances */}
        {/* Étape 5 - Portfolio (uniquement pour freelances) */}
        {userType && (
          <Step>
            {isFreelancer && selectedCategory && (
              <>
                <h2 className="font-semibold tracking-wider text-xl mb-4">
                  Portfolio & Links
                </h2>
                <div className="flex flex-col  space-y-4">
                  <span className="mt-2 text-white-50">Portfolio Link :</span>
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
                    <span className="mt-2 text-white-50">Other Links :</span>
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
              </>
            )}

            {isClient && (
              <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold">
                  Upload Your Profile Picture
                </h2>
                <div className="relative group">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 shadow-lg transition-transform duration-300 group-hover:brightness-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white-50 flex items-center justify-center border-2 border-dashed text-sm text-black font-semibold">
                      No Image
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer bg-white-300 text-white-50 hover:text-white-300 hover:bg-gray-50 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="hidden"
                    />
                    <Pencil size={16} />
                  </label>
                </div>
                <p className="text-white-50 text-center">
                  Make sure your photo is clear and recent.
                </p>
              </div>
            )}
          </Step>
        )}

        {/* Étape 6 - Upload photo (uniquement pour freelances) */}
        {isFreelancer && selectedCategory && (
          <Step>
            {selectedCategory && (
              <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl w-full max-w-md mx-auto">
                <h2 className="text-xl font-bold">
                  Upload Your Profile Picture
                </h2>
                <div className="relative group">
                  {profileImage ? (
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border-4 shadow-lg transition-transform duration-300 group-hover:brightness-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-white-50 flex items-center justify-center border-2 border-dashed text-sm text-black font-semibold">
                      No Image
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md cursor-pointer bg-white-300 text-white-50 hover:text-white-300 hover:bg-gray-50 transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfileImage(e.target.files[0])}
                      className="hidden"
                    />
                    <Pencil size={16} />
                  </label>
                </div>
                <p className="text-white-50 text-center">
                  Make sure your photo is clear and recent.
                </p>
              </div>
            )}
          </Step>
        )}
      </Stepper>
    </section>
  );
};

export default Stepping;