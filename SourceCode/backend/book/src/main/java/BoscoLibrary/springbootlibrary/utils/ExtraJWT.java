package BoscoLibrary.springbootlibrary.utils;


import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

public class ExtraJWT {

    //get the string of userEmail:  token--> sub ,  extraction: different information
    public static String payloadJWTExtraction (String token, String extraction) {
        token.replace("Bearer ", "");//remove the string of Authorization(postman)

        String[] chunka = token.split("\\."); //separate to 3 section: header, payload and signature

        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunka[1])); //only decode the section of payload

        String entries[] = payload.split(","); //separate to 2 section: title and data

        Map<String, String> map = new HashMap<String, String>(); //create the hashmap

        for (String entry : entries) {
            String keyValue[] = entry.split(":");
            if (keyValue[0].equals(extraction)) {
                int remove = 1;
                if (keyValue[1].endsWith("}")) {    //ending string of payload:}
                    remove = 2;
                }
                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);//remove " and }
                keyValue[1] = keyValue[1].substring(1);     //remove the first string----->  "
                map.put(keyValue[0], keyValue[1]);


            }


        }
        if (map.containsKey(extraction)){
            return map.get(extraction);
        }
        return null;
    }



}
