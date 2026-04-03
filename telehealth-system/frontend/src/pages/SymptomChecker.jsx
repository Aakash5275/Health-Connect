import SymptomCheckerComponent from '../components/SymptomChecker';

function SymptomChecker() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">AI Symptom Checker</h1>
      <p className="text-slate-500 mb-8">
        Describe your symptoms and get AI-powered health guidance
      </p>
      
      <SymptomCheckerComponent />
    </main>
  );
}

export default SymptomChecker;
