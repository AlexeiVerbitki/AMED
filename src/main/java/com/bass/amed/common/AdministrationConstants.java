package com.bass.amed.common;

public interface AdministrationConstants
{
    String[] TABLES                = new String[]{
            "nm_active_substances",
            "nm_atc_codes",
            "nm_authorization_comment",
            "nm_auxiliary_substances",
            "nm_bank_accounts",
            "nm_banks",
            "nm_clinic_trail_phases",
            "nm_countries",
            "nm_country_group",
            "nm_currencies",
            "nm_currencies_history",
            "nm_customs_codes",
            "nm_customs_groups",
            "nm_customs_points",
            "nm_document_types",
            "nm_documents_archive",
            "nm_economic_agent_bank_accounts",
            "nm_economic_agent_contact_info",
            "nm_economic_agent_types",
            "nm_economic_agents",
            "nm_employees",
            "nm_identification_document_types",
            "nm_international_medicament_names",
            "nm_investigators",
            "nm_labels",
            "nm_localities",
            "nm_manufacture_bank_accounts",
            "nm_manufactures",
            "nm_medical_institutions",
            "nm_medicament_forms",
            "nm_medicament_group",
            "nm_medicament_type",
            "nm_organization",
            "nm_organization_bank_accounts",
            "nm_partners",
            "nm_pharmaceutical_form_types",
            "nm_pharmaceutical_forms",
            "nm_price_types",
            "nm_prices",
            "nm_professions",
            "nm_states",
            "nm_subdivisions",
            "nm_taxes",
            "nm_traffic_archive",
            "nm_type_of_pharmacy_activity",
            "nm_types_of_customs_transactions",
            "nm_types_of_drug_changes",
            "nm_units_of_measurement",
            "nm_variation_request_type",
            "authorized_drug_substances",
            "service_charges",
            "nm_biological_medicines",
            "nm_gmp_manufacture",
            "nm_nesterile_products",
            "nm_primary_packaging",
            "nm_secondary_packaging",
            "nm_sterilizations",
            "nm_tests_for_quality_control",
            "nm_audit_category",
            "nm_audit_subcategory",
            "nm_import_activities",
            "nm_ldap_user_status",
            "nm_register_catalog_codes",
			"drug_units_conversion_rates",
    };
    String   SQL_GET_ALL_BY_TABLE  = "SELECT * FROM %s";
    String   SQL_DELETE_TABLE      = "DELETE FROM %s WHERE ID = :id";
    String   SQL_INSERT            = "INSERT INTO %s (%s) VALUES(%s)";
    String   SQL_UPDATE            = "UPDATE %s SET %s WHERE ID = %s";
    String   SQL_GET_COLUMNS_NAMES =
            "SELECT COLUMN_NAME, COLUMN_COMMENT\n" +
                    "FROM INFORMATION_SCHEMA.COLUMNS\n" +
                    "WHERE table_name = '%s'\n" +
                    "AND table_schema = 'amed'";
}
