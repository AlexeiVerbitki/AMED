package com.bass.amed.utils;

import com.bass.amed.common.AdministrationConstants;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class AdministrationUtils
{
    public static String getTableName(Map<String, Object> nomenclature)
    {
        Integer nr = 0;
        try
        {
            nr = Integer.parseInt(nomenclature.get("tableNr").toString());
        }
        catch (NumberFormatException e)
        {
            return null;
        }

        return AdministrationConstants.TABLES[nr - 1];
    }

    public static String createInsertQuery(Map<String, Object> row, String table)
    {
        StringBuilder snames  = new StringBuilder(100);
        StringBuilder svalues = new StringBuilder(100);
        row.forEach((k, v) -> {
            snames.append(k + ",");
            svalues.append(String.format("'%s',", v));
        });

        snames.deleteCharAt(snames.lastIndexOf(","));
        svalues.deleteCharAt(svalues.lastIndexOf(","));

        String colls  = snames.toString();
        String values = svalues.toString();

        String sqlInsertQuerry = String.format(AdministrationConstants.SQL_INSERT, table, colls, values);
        return sqlInsertQuerry;
    }

    public static String createUpdateQuery(Map<String, Object> row, String table)
    {
        StringBuilder paramsStringBuilder = new StringBuilder(100);
        String        id                  = row.get("id").toString();

        row.forEach((k, v) -> {
            paramsStringBuilder.append(String.format("%s = '%s',", k, v));
        });

        paramsStringBuilder.deleteCharAt(paramsStringBuilder.lastIndexOf(","));

        String params = paramsStringBuilder.toString();

        String sqlInsertQuerry = String.format(AdministrationConstants.SQL_UPDATE, table, params, id);
        return sqlInsertQuerry;
    }

    public String removeUnnecessaryFields(Map<Integer, VariationType> map, List<VariationType> variations)
    {
        String json = "";
        if (variations != null && !variations.isEmpty())
        {
            for (VariationType v : variations)
            {
                json = json + "\"" + v.getCode() + " - " + v.getDescription() + "\"";
                if (!v.getChildrens().isEmpty())
                {
                    json = json + ":{" + removeUnnecessaryFields(map, v.getChildrens()) + "},";
                }
                else
                {
                    if (v.getPossibleValues() != null && !v.getPossibleValues().isEmpty())
                    {
                        json = json + ":{";
                        String[] arr = v.getPossibleValues().split(",");
                        for (String a : arr)
                        {
                            if (v.getCode().length() > 1)
                            {
                                json = json + "\"" + v.getCode() + " - " + a + "\":null,";
                            }
                            else
                            {
                                VariationType parent = map.get(v.getParentId());
                                if (parent.getCode().length() > 1)
                                {
                                    json = json + "\"" + parent.getCode() + "-" + v.getCode() + " - " + a + "\":null,";
                                }
                                else
                                {
                                    VariationType parent2 = map.get(parent.getParentId());
                                    json = json + "\"" + parent2.getCode() + "-" + parent.getCode() + "-" + v.getCode() + " - " + a + "\":null,";
                                }
                            }
                        }
                        json = json.substring(0, json.length() - 1);
                        json = json + "},";
                    }
                    else
                    {
                        json = json + ": null,";
                    }
                }
            }
            json = json.substring(0, json.length() - 1);
        }
        return json;
    }

    public String getJSONWithIds(Map<Integer, VariationType> map, List<VariationType> variations)
    {
        String json = "";
        if (variations != null && !variations.isEmpty())
        {
            for (VariationType v : variations)
            {
                json = json + "\"" + v.getCode() + " - " + v.getDescription() + "\"";
                if (!v.getChildrens().isEmpty())
                {
                    json = json + ":{" + getJSONWithIds(map, v.getChildrens()) + "},";
                }
                else
                {
                    if (v.getPossibleValues() != null && !v.getPossibleValues().isEmpty())
                    {
                        json = json + ":{";
                        String[] arr = v.getPossibleValues().split(",");
                        for (String a : arr)
                        {
                            if (v.getCode().length() > 1)
                            {
                                json = json + "\"" + v.getCode() + " - " + a + "\":\"" + v.getId() + "\",";
                            }
                            else
                            {
                                VariationType parent = map.get(v.getParentId());
                                if (parent.getCode().length() > 1)
                                {
                                    json = json + "\"" + parent.getCode() + "-" + v.getCode() + " - " + a + "\":\"" + v.getId() + "\",";
                                }
                                else
                                {
                                    VariationType parent2 = map.get(parent.getParentId());
                                    json = json + "\"" + parent2.getCode() + "-" + parent.getCode() + "-" + v.getCode() + " - " + a + "\":\"" + v.getId() + "\",";
                                }
                            }
                        }
                        json = json.substring(0, json.length() - 1);
                        json = json + "},";
                    }
                    else
                    {
                        json = json + ":\"" + v.getId() + "\",";
                    }
                }
            }
            json = json.substring(0, json.length() - 1);
        }
        return json;
    }

    public class VariationType
    {
        public VariationType(Integer id, Integer parentId, String code, String description, String possibleValues)
        {
            this.id = id;
            this.parentId = parentId;
            this.code = code;
            this.description = description;
            this.possibleValues = possibleValues;
            childrens = new ArrayList<VariationType>();
        }

        public Integer             id;
        public Integer             parentId;
        public String              code;
        public String              description;
        public String              possibleValues;
        public List<VariationType> childrens;

        public Integer getId()
        {
            return id;
        }

        public void setId(Integer id)
        {
            this.id = id;
        }

        public Integer getParentId()
        {
            return parentId;
        }

        public void setParentId(Integer parentId)
        {
            this.parentId = parentId;
        }

        public String getCode()
        {
            return code;
        }

        public void setCode(String code)
        {
            this.code = code;
        }

        public String getDescription()
        {
            return description;
        }

        public void setDescription(String description)
        {
            this.description = description;
        }

        public String getPossibleValues()
        {
            return possibleValues;
        }

        public void setPossibleValues(String possibleValues)
        {
            this.possibleValues = possibleValues;
        }

        public List<VariationType> getChildrens()
        {
            return childrens;
        }

        public void setChildrens(List<VariationType> childrens)
        {
            this.childrens = childrens;
        }
    }
}
