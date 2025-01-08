import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import InterestedUsersTable from "./InterestedUsersTable";
import ScheduledMeetingUsers from "../components/ScheduledMeetingUsers";

const InterestedUsersTablePage = () => {
    const { user } = useContext(AuthContext);
    const companyId = user?.company_relation;
  
    if (!companyId) {
      return <p className="text-red-500">No se encontró la información de la empresa.</p>;
    }
  
    return (
      <div className="bg-gray-800 min-h-screen p-6">
        <h1 className="text-3xl font-bold mt-20 mb-8 text-center text-white">
          Tabla de Usuarios Interesados
        </h1>
        <div>
          <InterestedUsersTable companyId={companyId} />
        </div>
        <div>
          <ScheduledMeetingUsers companyId={companyId} />
        </div>
      </div>
    );
  };

export default InterestedUsersTablePage;
