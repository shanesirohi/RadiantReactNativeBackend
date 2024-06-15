import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../(services)/api/api";
import { Picker } from "@react-native-picker/picker"; // Updated import
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterSchema = Yup.object().shape({
  username: Yup.string().min(6, "Too Short!").required("Required"),
  password: Yup.string().min(6, "Too Short!").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  school: Yup.string().required("Required"),
  interest: Yup.string().required("Required"),
});

export default function Register() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const mutation = useMutation({
    mutationFn: registerUser,
    mutationKey: ["register"],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      {mutation?.isError ? (
        <Text style={styles.errorText}>
          {mutation?.error?.response?.data?.message}
        </Text>
      ) : null}
      {mutation?.isSuccess ? (
        <Text style={styles.successText}>
          {mutation?.error?.response?.data?.message}
        </Text>
      ) : null}
      <Formik
        initialValues={{
          username: "",
          password: "",
          confirmPassword: "",
          school: "", // Added school field
          interest: "", // Added favorite music genre field
        }}
        validationSchema={RegisterSchema}
        onSubmit={async (values) => {
          const data = {
            username: values.username,
            password: values.password,
            school: values.school,
            interest: values.interest,
          };
          try {
            await mutation.mutateAsync(data);
            setMessage("Registration successful!");
            setMessageType("success");
            await AsyncStorage.setItem('username', values.username); // Store username in AsyncStorage
            setTimeout(() => {
              setMessage("");
              router.push("/(tabs)");
            }, 2000); // Redirect after 2 seconds
          } catch (error) {
            setMessage(error?.response?.data?.message);
            setMessageType("error");
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              value={values.username}
              keyboardType="username"
            />
            {errors.username && touched.username ? (
              <Text style={styles.errorText}>{errors.username}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={handleChange("password")}
              onBlur={handleBlur("password")}
              value={values.password}
              secureTextEntry
            />
            {errors.password && touched.password ? (
              <Text style={styles.errorText}>{errors.password}</Text>
            ) : null}
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={handleChange("confirmPassword")}
              onBlur={handleBlur("confirmPassword")}
              value={values.confirmPassword}
              secureTextEntry
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            ) : null}
            {/* School selection dropdown */}
            <Text style={styles.label}>Select School</Text>
            <Picker
              selectedValue={values.school}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                handleChange("school")(itemValue)
              }
            >
              <Picker.Item label="DPS" value="DPS" />
              <Picker.Item label="Jaipuria" value="Jaipuria" />
              <Picker.Item label="Amity" value="Amity" />
            </Picker>
            {errors.school && touched.school ? (
              <Text style={styles.errorText}>{errors.school}</Text>
            ) : null}
            {/* Favorite music genre field */}
            <Text style={styles.label}>Choose your interest</Text>
            <Picker
              selectedValue={values.interest}
              style={styles.input}
              onValueChange={(itemValue, itemIndex) =>
                handleChange("interest")(itemValue)
              }
            >
              <Picker.Item label="Gaming" value="Gaming" />
              <Picker.Item label="Music" value="Music" />
              <Picker.Item label="Singing" value="Singing" />
              <Picker.Item label="Sports" value="Sports" />
              <Picker.Item label="Poetry/Writing" value="Writing" />
              <Picker.Item label="Tech" value="Tech" />
            </Picker>
            {errors.interest && touched.interest ? (
              <Text style={styles.errorText}>{errors.interest}</Text>
            ) : null}


            {/* Button for form submission */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={mutation.isLoading}
            >
              {mutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 24,
  },
  form: {
    width: "100%",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
  successText: {
    color: "green",
    marginBottom: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#6200ea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
